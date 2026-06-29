-- ============================================================
-- 투표(의제) 기능 DB 설정 — Supabase SQL Editor에서 실행
-- ============================================================

-- 0) 정회원 컬럼
alter table profiles add column if not exists is_member boolean not null default false;

-- 슈퍼관리자(tony)는 정회원으로 지정 (투표/집계 기준 포함)
update profiles set is_member = true where email = 'tony@banya.ai';

-- ============================================================
-- 1) 권한 헬퍼
-- ============================================================
create or replace function is_super_admin()
returns boolean language sql stable as $$
  select coalesce((auth.jwt() ->> 'email') = 'tony@banya.ai', false);
$$;

create or replace function is_full_member()
returns boolean language sql stable security definer set search_path = public as $$
  select is_super_admin()
      or coalesce((select is_member from profiles where id = auth.uid()), false);
$$;

-- ============================================================
-- 2) 정회원 권한 부여/해제 (슈퍼관리자 전용)
-- ============================================================
create or replace function set_member(target_id uuid, value boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_super_admin() then
    raise exception '권한이 없습니다.';
  end if;
  update profiles set is_member = value where id = target_id;
end;
$$;

-- ============================================================
-- 3) 투표 테이블
-- ============================================================
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  deadline timestamptz not null,
  created_by uuid references auth.users(id),
  published boolean not null default false,
  published_at timestamptz,
  result_topic_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists vote_ballots (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references votes(id) on delete cascade,
  voter_id uuid not null references auth.users(id),
  choice text not null check (choice in ('for','against','abstain')),
  created_at timestamptz not null default now(),
  unique (vote_id, voter_id)   -- 1인 1표
);

alter table votes enable row level security;
alter table vote_ballots enable row level security;

-- 투표 의제: 정회원 열람 / 슈퍼관리자만 생성
drop policy if exists votes_select on votes;
create policy votes_select on votes for select to authenticated
  using (is_full_member());

drop policy if exists votes_insert on votes;
create policy votes_insert on votes for insert to authenticated
  with check (is_super_admin() and created_by = auth.uid());

-- 투표지: 본인 것만 조회(익명 보장) / 정회원 본인만 투표
drop policy if exists ballots_select on vote_ballots;
create policy ballots_select on vote_ballots for select to authenticated
  using (voter_id = auth.uid());

drop policy if exists ballots_insert on vote_ballots;
create policy ballots_insert on vote_ballots for insert to authenticated
  with check (voter_id = auth.uid() and is_full_member());

-- ============================================================
-- 4) 익명 집계 RPC (개표는 집계값만 반환)
-- ============================================================
create or replace function vote_tally(p_vote_id uuid)
returns table (for_count int, against_count int, abstain_count int, total_votes int, eligible int)
language sql security definer set search_path = public as $$
  select
    count(*) filter (where choice='for')::int,
    count(*) filter (where choice='against')::int,
    count(*) filter (where choice='abstain')::int,
    count(*)::int,
    (select count(*) from profiles where is_member = true)::int
  from vote_ballots where vote_id = p_vote_id;
$$;

-- ============================================================
-- 5) 마감 시 결과를 공지사항에 자동 등록 (멱등)
-- ============================================================
create or replace function publish_vote_result(p_vote_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v record;
  t_for int; t_against int; t_abstain int; t_total int; t_elig int;
  topic_id uuid; body_html text; outcome text; rate int;
begin
  select * into v from votes where id = p_vote_id;
  if not found then return null; end if;
  if v.published then return v.result_topic_id; end if;     -- 이미 게시됨
  if v.deadline > now() then return null; end if;           -- 아직 진행 중

  select
    count(*) filter (where choice='for'),
    count(*) filter (where choice='against'),
    count(*) filter (where choice='abstain'),
    count(*)
  into t_for, t_against, t_abstain, t_total
  from vote_ballots where vote_id = p_vote_id;

  select count(*) into t_elig from profiles where is_member = true;
  rate := case when t_elig > 0 then round(t_total::numeric * 100 / t_elig) else 0 end;
  outcome := case
    when t_for > t_against then '가결'
    when t_against > t_for then '부결'
    else '보류 (동수)'
  end;

  body_html := format(
    '<p><strong>의제:</strong> %s</p>'
    '<p><strong>의결 결과: %s</strong></p>'
    '<ul><li>찬성 — %s표</li><li>반대 — %s표</li><li>기권 — %s표</li></ul>'
    '<p>총 투표 %s명 / 정회원 %s명 · 투표율 %s%%</p>'
    '<p style="color:#64748b;font-size:0.85em;">※ 본 결과는 투표 마감과 함께 자동 게시되었습니다. 투표는 익명으로 집계됩니다.</p>',
    v.title, outcome, t_for, t_against, t_abstain, t_total, t_elig, rate
  );

  insert into topics (title, category, tags, author_id, author_name, last_activity_by, last_activity_at)
  values ('[투표결과] ' || v.title, '공지사항', array['투표','공지'],
          v.created_by, '협동조합 사무국', '협동조합 사무국', now())
  returning id into topic_id;

  insert into posts (topic_id, author_id, author_name, content)
  values (topic_id, v.created_by, '협동조합 사무국', body_html);

  update votes set published = true, result_topic_id = topic_id, published_at = now()
  where id = p_vote_id;

  return topic_id;
end;
$$;

-- ============================================================
-- 6) 새 공지사항 → 전체 회원 메시지박스 알림 (fan-out)
--    (투표 결과 공지뿐 아니라 모든 '공지사항' 주제에 적용)
-- ============================================================
create or replace function notify_all_on_notice()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if NEW.category = '공지사항' then
    insert into notifications (user_id, type, actor_name, body, data, read)
    select p.id, 'notice', NEW.author_name, '새 공지사항: ' || NEW.title,
           jsonb_build_object('topic_id', NEW.id), false
    from profiles p;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_notify_notice on topics;
create trigger trg_notify_notice after insert on topics
for each row execute function notify_all_on_notice();
