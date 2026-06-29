-- E2E 테스트 데이터 정리 — Supabase SQL Editor에서 1회 실행
delete from notifications where data->>'topic_id' in (
  select id::text from topics where title like '[투표결과] E2E%'
);
delete from posts where topic_id in (select id from topics where title like '[투표결과] E2E%');
delete from topics where title like '[투표결과] E2E%';
delete from votes where title like 'E2E %';   -- vote_ballots는 on delete cascade로 함께 삭제
