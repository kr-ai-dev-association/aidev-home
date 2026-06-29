-- ============================================================
-- 댓글 도배 방지 (계정 기반, 전부 서버 트리거 강제 — API 우회 불가)
--   1) 15초 최소 간격
--   2) 최근 10분 내 10개 이상 → 30분 차단
--   3) 차단 해제 후 또 10개 이상 → 1시간 차단 (에스컬레이션)
--      · 24시간 무위반 시 위반 단계 리셋
--   · 수퍼관리자/관리자는 예외
-- ============================================================

-- 상태 추적 컬럼
alter table profiles add column if not exists comment_blocked_until timestamptz;
alter table profiles add column if not exists comment_violation_level integer not null default 0;
alter table profiles add column if not exists comment_last_violation_at timestamptz;

create or replace function ratelimit_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_priv boolean;
  blocked_until timestamptz;
  vlevel integer;
  last_violation timestamptz;
  recent_15s integer;
  recent_10m integer;
  remain_min integer;
begin
  -- 수퍼관리자/관리자는 제한 없음
  select is_super_admin()
      or coalesce((select is_admin from profiles where id = NEW.author_id), false)
    into is_priv;
  if is_priv then return NEW; end if;

  select comment_blocked_until, comment_violation_level, comment_last_violation_at
    into blocked_until, vlevel, last_violation
    from profiles where id = NEW.author_id;

  -- 24시간 무위반 시 위반 단계 리셋
  if last_violation is not null and last_violation < now() - interval '24 hours' then
    vlevel := 0;
    update profiles set comment_violation_level = 0 where id = NEW.author_id;
  end if;

  -- 차단 중이면 거부
  if blocked_until is not null and blocked_until > now() then
    remain_min := ceil(extract(epoch from (blocked_until - now())) / 60);
    raise exception '댓글 작성이 일시 중지되었습니다. 약 %분 후 다시 시도해주세요.', remain_min;
  end if;

  -- 1) 15초 최소 간격
  select count(*) into recent_15s from comments
    where author_id = NEW.author_id and created_at > now() - interval '15 seconds';
  if recent_15s > 0 then
    raise exception '댓글은 15초에 1회만 작성할 수 있습니다. 잠시 후 다시 시도해주세요.';
  end if;

  -- 2)·3) 최근 10분 내 10개 이상 → 차단(에스컬레이션)
  select count(*) into recent_10m from comments
    where author_id = NEW.author_id and created_at > now() - interval '10 minutes';
  if recent_10m >= 10 then
    vlevel := coalesce(vlevel, 0) + 1;
    update profiles set
      comment_violation_level = vlevel,
      comment_last_violation_at = now(),
      comment_blocked_until = now() + (case when vlevel >= 2 then interval '1 hour' else interval '30 minutes' end)
    where id = NEW.author_id;
    raise exception '연속 댓글이 너무 많습니다. % 동안 댓글 작성이 중지됩니다.',
      (case when vlevel >= 2 then '1시간' else '30분' end);
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_ratelimit_comment on comments;
create trigger trg_ratelimit_comment before insert on comments
for each row execute function ratelimit_comment();
