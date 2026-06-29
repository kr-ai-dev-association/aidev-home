-- E2E 테스트 데이터 정리 — Supabase SQL Editor에서 1회 실행
-- (앞선 voting_cleanup_test.sql 내용도 포함)

-- 1) 투표 결과 공지 알림 + 댓글 알림(테스트 주제) 제거
delete from notifications
where data->>'topic_id' in (
  select id::text from topics
  where title like '[투표결과] E2E%' or title like 'E2E %'
);

-- 2) 결과 공지/테스트 주제의 본문·댓글·주제 제거
delete from comments where post_id in (
  select p.id from posts p join topics t on t.id = p.topic_id
  where t.title like '[투표결과] E2E%' or t.title like 'E2E %'
);
delete from posts where topic_id in (
  select id from topics where title like '[투표결과] E2E%' or title like 'E2E %'
);
delete from topics where title like '[투표결과] E2E%' or title like 'E2E %';

-- 3) 투표/투표지 제거 (vote_ballots는 on delete cascade)
delete from votes
where title like 'E2E %' or title like '마감검증%' or title like '권한없는%';

-- 3-1) 코인 E2E 커뮤니티 글/댓글/알림 제거
delete from comments where post_id in (
  select p.id from posts p join topics t on t.id = p.topic_id
  where t.title like '코인 %' or t.title like '도배%'
);
delete from posts where topic_id in (
  select id from topics where title like '코인 %' or title like '도배%'
);
delete from notifications where data->>'topic_id' in (
  select id::text from topics where title like '코인 %' or title like '도배%'
);
delete from topics where title like '코인 %' or title like '도배%';

-- 3-2) 방어로직 E2E 주제/댓글 제거
delete from comments where post_id in (
  select p.id from posts p join topics t on t.id = p.topic_id where t.title like '방어로직%'
);
delete from posts where topic_id in (select id from topics where title like '방어로직%');
delete from topics where title like '방어로직%';

-- 4) 취업 테스트 공고 제거
delete from jobs where title like 'E2E %' or title like '코인 차감%';

-- 5) 테스트 DM(메시지/대화) 제거
delete from messages where content in ('공고 관련 문의드립니다.');
delete from conversations c
where not exists (select 1 from messages m where m.conversation_id = c.id);
