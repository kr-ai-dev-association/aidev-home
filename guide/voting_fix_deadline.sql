-- 투표 무결성 수정: 마감된 의제에는 투표 불가하도록 RLS에 마감시간 검증 추가
-- (프론트는 버튼을 숨기지만 API 직접 호출 시 마감 후 투표가 가능했던 문제 차단)
drop policy if exists ballots_insert on vote_ballots;
create policy ballots_insert on vote_ballots for insert to authenticated
  with check (
    voter_id = auth.uid()
    and is_full_member()
    and exists (select 1 from votes v where v.id = vote_id and v.deadline > now())
  );
