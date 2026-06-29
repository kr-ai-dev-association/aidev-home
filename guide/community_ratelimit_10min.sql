-- 커뮤니티 글 작성 도배/봇 방지: 10분에 1회 제한
--   · 수퍼관리자(tony) / 관리자(is_admin)는 제한 없음
--   · 새 주제(INSERT)에만 적용 — 편집(UPDATE)·댓글(comments)은 무관
--   · 공지사항(관리자 전용) 제외
create or replace function ratelimit_topic()
returns trigger language plpgsql security definer set search_path = public as $$
declare recent integer; is_priv boolean;
begin
  if NEW.category is distinct from '공지사항' then
    -- 수퍼관리자/관리자는 작성 간격 제한 없음
    select is_super_admin()
        or coalesce((select is_admin from profiles where id = NEW.author_id), false)
      into is_priv;
    if not is_priv then
      select count(*) into recent from topics
      where author_id = NEW.author_id
        and created_at > now() - interval '10 minutes';
      if recent > 0 then
        raise exception '커뮤니티 글은 10분에 1회만 작성할 수 있습니다. 잠시 후 다시 시도해주세요.';
      end if;
    end if;
  end if;
  return NEW;
end;
$$;

-- 트리거가 이미 있으면 재사용됨(없을 경우에만 생성)
drop trigger if exists trg_ratelimit_topic on topics;
create trigger trg_ratelimit_topic before insert on topics
for each row execute function ratelimit_topic();
