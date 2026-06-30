-- 공고 스크랩(북마크)
--   · 취업 페이지에서 지원자가 공고를 스크랩
--   · '내 지원 관리' 페이지의 스크랩 탭에서 조회/삭제
--   · 본인 데이터만 조회·생성·삭제 (RLS)

create table if not exists job_scraps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)            -- 한 공고 1회 스크랩
);

alter table job_scraps enable row level security;

drop policy if exists scrap_select on job_scraps;
create policy scrap_select on job_scraps for select to authenticated
  using (user_id = auth.uid());

drop policy if exists scrap_insert on job_scraps;
create policy scrap_insert on job_scraps for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists scrap_delete on job_scraps;
create policy scrap_delete on job_scraps for delete to authenticated
  using (user_id = auth.uid());
