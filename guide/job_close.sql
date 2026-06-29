-- 취업 공고 마감 기능: closed 컬럼 추가
--   · 마감/마감취소는 jobs UPDATE 정책(작성자·관리자)이 이미 있으므로 컬럼만 추가하면 됩니다.
--   · 마감된 공고도 목록에 계속 표시(필터링하지 않음).
alter table jobs add column if not exists closed boolean not null default false;
