-- 알림(notifications) 삭제 권한
--   · 알림을 받은(=조회 가능한) 본인은 자신의 알림을 삭제할 수 있다
--   · 관리자(is_admin)/수퍼관리자는 누구의 알림이든 삭제 가능
--   · 전부 서버 RLS로 강제 (프런트의 삭제 버튼은 이 정책에 의해 보장됨)
-- 의존: is_admin_user() (guide/community_admin_delete.sql 에서 정의)

-- 안전장치: RLS 활성화 (이미 켜져 있으면 무해)
alter table notifications enable row level security;

-- 본인 알림 삭제: user_id = 현재 로그인 사용자, 또는 관리자
drop policy if exists notifications_delete on notifications;
create policy notifications_delete on notifications for delete to authenticated
  using (user_id = auth.uid() or is_admin_user());
