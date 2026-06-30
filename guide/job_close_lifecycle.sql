-- 채용공고·프로젝트 구인 마감 라이프사이클
--   · 마감 시 closed=true, closed_at=now() 기록 (프런트에서 설정)
--   · 마감 후 리스트엔 '마감'으로 표시, 1개월 경과 시 자동 삭제
--   · 외주 프로젝트는 기존대로 deadline(마감 기한) 기준 자동 삭제 유지

-- 1) 마감 시각 컬럼
alter table jobs add column if not exists closed_at timestamptz;

-- 2) 통합 자동 정리 함수 (페이지 로드 시 프런트에서 호출 + pg_cron 권장)
--    a. 외주: 미마감(closed=false)인데 deadline 경과 → 삭제 (계약 미체결 종료)
--    b. 채용/프로젝트 구인: 마감(closed=true) 후 1개월 경과 → 삭제
create or replace function purge_expired_jobs()
returns void language plpgsql security definer set search_path = public as $$
begin
  -- a) 기한 지난 미마감 외주
  delete from jobs
  where board_type = '외주 프로젝트'
    and closed = false
    and deadline is not null
    and deadline < now();

  -- b) 마감 1개월 경과한 채용공고·프로젝트 구인
  delete from jobs
  where board_type in ('채용공고', '프로젝트 구인')
    and closed = true
    and closed_at is not null
    and closed_at < now() - interval '1 month';
end;
$$;

-- 3) (선택) 기존 외주 전용 함수와의 호환 — 남겨두면 폴백 호출도 동작
--    이미 purge_expired_outsource_jobs() 가 있다면 그대로 유지됩니다.

-- 4) (권장) pg_cron 으로 매일 자동 정리 — 확장 활성화 후 주석 해제
-- select cron.schedule('purge-expired-jobs', '0 3 * * *', $$ select purge_expired_jobs(); $$);
