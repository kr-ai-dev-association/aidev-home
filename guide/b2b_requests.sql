-- 조합 B2B 의뢰(견적 문의 / 평가 신청)
--   · 입력: 로그인한 조합원이면 누구나(정회원 아니어도) 본인 명의로 의뢰 가능
--   · 조회/상태변경: 관리자만 (is_admin_user — community_admin_delete.sql에서 생성)

create table if not exists b2b_requests (
  id uuid primary key default gen_random_uuid(),
  type text not null,                 -- '조합 B2B 견적 문의' | '조합 B2B 평가 신청'
  company text,
  contact_name text,
  email text,
  phone text,
  message text not null,
  requester_id uuid references auth.users(id),
  requester_name text,
  status text not null default 'new', -- new | in_progress | done
  created_at timestamptz not null default now()
);

alter table b2b_requests enable row level security;

-- 입력: 인증된 조합원 누구나(본인 명의로만)
drop policy if exists b2b_insert on b2b_requests;
create policy b2b_insert on b2b_requests for insert to authenticated
  with check (requester_id = auth.uid());

-- 조회: 관리자만
drop policy if exists b2b_select on b2b_requests;
create policy b2b_select on b2b_requests for select to authenticated
  using (is_admin_user());

-- 상태 변경: 관리자만
drop policy if exists b2b_update on b2b_requests;
create policy b2b_update on b2b_requests for update to authenticated
  using (is_admin_user()) with check (is_admin_user());
