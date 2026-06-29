-- ============================================================
-- 포인트(coin) 시스템 — Supabase SQL Editor에서 실행
--   · 정회원 승인 시 1000 coin 지급
--   · 취업 공고 작성 시 10 coin 차감(부족 시 작성 불가)
--   · 커뮤니티 글 작성 시 1 coin 적립
--   · 커뮤니티 도배(봇) 방지 작성 간격 제한
-- ============================================================

-- 1) 코인 잔액 컬럼 + 거래 내역 테이블
alter table profiles add column if not exists coins integer not null default 0;

create table if not exists coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount integer not null,           -- +적립 / -차감
  reason text not null,
  created_at timestamptz not null default now()
);
alter table coin_transactions enable row level security;
drop policy if exists coin_tx_select on coin_transactions;
create policy coin_tx_select on coin_transactions for select to authenticated
  using (user_id = auth.uid());
-- INSERT는 아래 SECURITY DEFINER 함수/트리거로만 수행(별도 insert 정책 없음)

-- 기존 정회원 초기 코인 지급(1회): 아직 코인이 없는 정회원에게 1000
update profiles set coins = 1000 where is_member = true and coins = 0;

-- 2) 정회원 최초 승인 시 1000 coin 지급 (set_member 갱신)
create or replace function set_member(target_id uuid, value boolean)
returns void language plpgsql security definer set search_path = public as $$
declare was_member boolean;
begin
  if not is_super_admin() then
    raise exception '권한이 없습니다.';
  end if;
  select is_member into was_member from profiles where id = target_id;
  update profiles set is_member = value where id = target_id;
  if value and not coalesce(was_member, false) then
    update profiles set coins = coins + 1000 where id = target_id;
    insert into coin_transactions (user_id, amount, reason)
    values (target_id, 1000, '정회원 승인 지급');
  end if;
end;
$$;

-- 3) 취업 공고 작성 시 10 coin 차감 (부족하면 작성 불가)
create or replace function charge_coins_on_job()
returns trigger language plpgsql security definer set search_path = public as $$
declare bal integer;
begin
  select coins into bal from profiles where id = NEW.author_id;
  if coalesce(bal, 0) < 10 then
    raise exception '코인이 부족합니다. 취업 공고 작성에는 10 coin이 필요합니다. (보유: % coin)', coalesce(bal, 0);
  end if;
  update profiles set coins = coins - 10 where id = NEW.author_id;
  insert into coin_transactions (user_id, amount, reason)
  values (NEW.author_id, -10, '취업 공고 작성');
  return NEW;
end;
$$;
drop trigger if exists trg_charge_job on jobs;
create trigger trg_charge_job before insert on jobs
for each row execute function charge_coins_on_job();

-- 4) 커뮤니티 글 작성 시 1 coin 적립 (공지사항 제외)
create or replace function award_coins_on_topic()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if NEW.category is distinct from '공지사항' then
    update profiles set coins = coins + 1 where id = NEW.author_id;
    insert into coin_transactions (user_id, amount, reason)
    values (NEW.author_id, 1, '커뮤니티 글 작성');
  end if;
  return NEW;
end;
$$;
drop trigger if exists trg_award_topic on topics;
create trigger trg_award_topic after insert on topics
for each row execute function award_coins_on_topic();

-- 5) 봇 도배 방지: 커뮤니티 글 작성 간격 제한(서버 측 최종 방어선)
--    프론트 우회(API 직접 호출)로 무작위 대량 작성하는 봇을 차단
create or replace function ratelimit_topic()
returns trigger language plpgsql security definer set search_path = public as $$
declare recent integer;
begin
  if NEW.category is distinct from '공지사항' then
    select count(*) into recent from topics
    where author_id = NEW.author_id
      and created_at > now() - interval '15 seconds';
    if recent > 0 then
      raise exception '글 작성 간격이 너무 짧습니다. 도배 방지를 위해 잠시 후 다시 시도해주세요.';
    end if;
  end if;
  return NEW;
end;
$$;
drop trigger if exists trg_ratelimit_topic on topics;
create trigger trg_ratelimit_topic before insert on topics
for each row execute function ratelimit_topic();
