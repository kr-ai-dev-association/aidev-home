-- 커뮤니티 댓글 작성 시 0.1 coin 적립
-- (0.1 소수 지원을 위해 coins / amount 를 numeric 으로 변경)

-- 1) 소수 지원으로 컬럼 타입 변경
alter table profiles
  alter column coins type numeric(12,2) using coins::numeric(12,2);
alter table profiles
  alter column coins set default 0;
alter table coin_transactions
  alter column amount type numeric(12,2) using amount::numeric(12,2);

-- 2) 댓글 작성 시 0.1 coin 적립
create or replace function award_coins_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update profiles set coins = coins + 0.1 where id = NEW.author_id;
  insert into coin_transactions (user_id, amount, reason)
  values (NEW.author_id, 0.1, '커뮤니티 댓글 작성');
  return NEW;
end;
$$;
drop trigger if exists trg_award_comment on comments;
create trigger trg_award_comment after insert on comments
for each row execute function award_coins_on_comment();
