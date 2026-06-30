-- 분쟁 해결 시스템 (외주 프로젝트)
--   · 마감(계약 체결)된 외주 공고의 의뢰자·수행자가 분쟁을 접수
--   · 접수 시 공고+기능요구사항 스냅샷이 함께 전달되고 관리자에게 알림
--   · 관리자가 '분쟁 조정'을 개시하면 당사자에게 알림(+이메일)이 발송됨
--   · is_admin_user() 는 community_admin_delete.sql 에서 정의

create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete set null,
  job_title text,
  job_snapshot jsonb,                 -- 공고 + 기능 요구사항 스냅샷(공고 삭제 대비)
  reporter_id uuid references auth.users(id),
  reporter_name text,
  reporter_role text,                 -- 의뢰자 | 수행자
  client_id uuid,                     -- 의뢰자(공고 작성자)
  contractor_id uuid,                 -- 수행자(계약자)
  content text not null,
  status text not null default 'open',-- open | mediating | resolved
  created_at timestamptz not null default now()
);

alter table disputes enable row level security;

-- 접수: 해당 공고의 의뢰자 또는 수행자만, 본인 명의로
drop policy if exists disputes_insert on disputes;
create policy disputes_insert on disputes for insert to authenticated
  with check (reporter_id = auth.uid() and (auth.uid() = client_id or auth.uid() = contractor_id));

-- 조회: 당사자(의뢰자/수행자) 또는 관리자
drop policy if exists disputes_select on disputes;
create policy disputes_select on disputes for select to authenticated
  using (client_id = auth.uid() or contractor_id = auth.uid() or is_admin_user());

-- 상태/조정: 관리자
drop policy if exists disputes_update on disputes;
create policy disputes_update on disputes for update to authenticated
  using (is_admin_user()) with check (is_admin_user());

-- 분쟁 접수 시 관리자에게 알림 fan-out
create or replace function notify_admins_on_dispute()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications (user_id, type, actor_name, body, data, read)
  select p.id, 'dispute', NEW.reporter_name,
         '새 분쟁이 접수되었습니다: ' || coalesce(NEW.job_title, '외주 프로젝트'),
         jsonb_build_object('dispute_id', NEW.id), false
  from profiles p
  where p.is_admin = true or p.email = 'tony@banya.ai';
  return NEW;
end;
$$;
drop trigger if exists trg_notify_dispute on disputes;
create trigger trg_notify_dispute after insert on disputes
for each row execute function notify_admins_on_dispute();

-- 분쟁 조정 개시(관리자): 상태 변경 + 당사자 알림 + 발송할 메시지 반환
create or replace function mediate_dispute(p_dispute_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare d record; msg text;
begin
  if not is_admin_user() then raise exception '권한이 없습니다.'; end if;
  select * into d from disputes where id = p_dispute_id;
  if not found then raise exception '분쟁을 찾을 수 없습니다.'; end if;

  update disputes set status = 'mediating' where id = p_dispute_id;

  msg := '[분쟁 조정 개시 안내] 회원님이 당사자인 외주 프로젝트 「' || coalesce(d.job_title, '프로젝트')
       || '」에 대한 분쟁 조정 절차가 개시되었습니다. 한국인공지능개발자 협동조합은 IT·인공지능 전문가와 변호사로 구성된 조정단을 파견하여, '
       || '공고의 내용과 기능 요구사항, 그리고 당사자 간 계약서에 근거하여 본 사건을 면밀히 조사·조정합니다. 진행 경과는 별도로 안내드립니다.';

  insert into notifications (user_id, type, actor_name, body, data, read)
  select uid, 'dispute', '협동조합 분쟁조정위원회', msg, jsonb_build_object('dispute_id', d.id), false
  from (select d.client_id as uid union select d.contractor_id) u
  where uid is not null;

  return msg;
end;
$$;
