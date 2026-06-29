-- 공고 플랫폼 지원/문의 + 지원 내역 관리
--   · is_admin_user() 는 community_admin_delete.sql 에서 생성됨

-- 1) 공고에 '플랫폼 지원받기' 활성화 플래그
alter table jobs add column if not exists platform_apply boolean not null default false;

-- 2) 지원 내역 테이블 (지원 내용 + 지원 시점 프로필 스냅샷)
create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  applicant_id uuid not null references auth.users(id),
  applicant_name text,
  message text,
  profile jsonb,                          -- 지원 시점 프로필 스냅샷
  status text not null default 'new',     -- new | reviewing | accepted | rejected
  created_at timestamptz not null default now(),
  unique (job_id, applicant_id)           -- 한 공고에 1회 지원
);

alter table job_applications enable row level security;

-- 지원: 로그인 조합원이 본인 명의로
drop policy if exists japp_insert on job_applications;
create policy japp_insert on job_applications for insert to authenticated
  with check (applicant_id = auth.uid());

-- 조회: 지원자 본인 / 공고 작성자 / 관리자
drop policy if exists japp_select on job_applications;
create policy japp_select on job_applications for select to authenticated
  using (
    applicant_id = auth.uid()
    or is_admin_user()
    or exists (select 1 from jobs j where j.id = job_id and j.author_id = auth.uid())
  );

-- 상태 변경: 공고 작성자 / 관리자
drop policy if exists japp_update on job_applications;
create policy japp_update on job_applications for update to authenticated
  using (is_admin_user() or exists (select 1 from jobs j where j.id = job_id and j.author_id = auth.uid()))
  with check (is_admin_user() or exists (select 1 from jobs j where j.id = job_id and j.author_id = auth.uid()));
