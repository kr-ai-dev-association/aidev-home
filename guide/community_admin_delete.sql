-- 커뮤니티 게시글(주제·게시글)·답글 삭제 권한
--   · 작성자 본인 또는 관리자(is_admin)/수퍼관리자는 누구의 글이든 삭제 가능
--   · 전부 서버 RLS로 강제

-- 관리자 여부 헬퍼 (현재 로그인 사용자 기준)
create or replace function is_admin_user()
returns boolean language sql stable security definer set search_path = public as $$
  select is_super_admin()
      or coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- topics 삭제: 작성자 또는 관리자
drop policy if exists topics_delete on topics;
create policy topics_delete on topics for delete to authenticated
  using (author_id = auth.uid() or is_admin_user());

-- posts 삭제: 작성자 또는 관리자
drop policy if exists posts_delete on posts;
create policy posts_delete on posts for delete to authenticated
  using (author_id = auth.uid() or is_admin_user());

-- comments(답글) 삭제: 작성자 또는 관리자
drop policy if exists comments_delete on comments;
create policy comments_delete on comments for delete to authenticated
  using (author_id = auth.uid() or is_admin_user());
