-- 코인 충전(관리자 수동 적립) — 1,000 coin 단위 충전 지원
--   · 조합원이 결제(회비/충전)하면 관리자가 1,000 단위로 코인을 적립
--   · is_admin_user() 는 community_admin_delete.sql 에서 생성됨

create or replace function admin_grant_coins(target_id uuid, amount integer, reason text default '코인 충전')
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin_user() then
    raise exception '권한이 없습니다.';
  end if;
  if amount is null or amount = 0 then
    raise exception '충전 금액이 올바르지 않습니다.';
  end if;
  update profiles set coins = coins + amount where id = target_id;
  insert into coin_transactions (user_id, amount, reason)
  values (target_id, amount, reason);
end;
$$;
