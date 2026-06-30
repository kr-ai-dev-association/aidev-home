-- 외주 프로젝트 라이프사이클: 마감 기한 + 계약자 지정 + 만료 자동 삭제
--   · 마감(closed)은 계약자(contractor_id) 지정과 함께 이루어진다(프런트에서 강제)
--   · 마감 기한(deadline)이 지났는데 마감되지 않은 외주 공고는 시스템이 자동 삭제
--   · 연장하려면 작성자가 공고를 수정해 deadline 을 변경

-- 1) 컬럼: 마감 기한, 계약자
alter table jobs add column if not exists deadline timestamptz;
alter table jobs add column if not exists contractor_id uuid references auth.users(id);

-- 2) 만료된(미마감) 외주 공고 자동 삭제 함수
--    job_applications 는 on delete cascade 로 함께 정리됨
create or replace function purge_expired_outsource_jobs()
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  with del as (
    delete from jobs
    where board_type = '외주 프로젝트'
      and coalesce(closed, false) = false
      and deadline is not null
      and deadline < now()
    returning id
  )
  select count(*) into n from del;
  return n;
end;
$$;

-- 3) (권장) pg_cron 으로 30분마다 자동 삭제 — Supabase에서 pg_cron 확장 필요
--    확장 활성화: Dashboard > Database > Extensions > pg_cron
-- select cron.schedule('purge-expired-outsource', '*/30 * * * *', $$ select purge_expired_outsource_jobs(); $$);
--
--    pg_cron 을 쓰지 않아도, 프런트(취업 페이지)가 로드될 때 purge_expired_outsource_jobs() 를
--    호출하므로 방문 시점마다 만료 공고가 정리됩니다.
