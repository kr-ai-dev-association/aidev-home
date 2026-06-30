-- 노동·계약 분쟁 조정 의뢰 (조합원 ↔ 기업)
--   · 외주 프로젝트 분쟁(disputes) 과는 별개 시스템
--   · 노동자/프리랜서/자영업자가 임금·해고·산재·불법파견·위장도급·불공정계약·기술탈취·지재권 등 분쟁을 의뢰
--   · 조합이 변호사·변리사·전문가를 배정해 단계별로 조정
--   · is_admin_user() 는 community_admin_delete.sql 에서 생성됨

-- 1) 조정 의뢰 본체
create table if not exists mediations (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  requester_name text,
  requester_type text not null,        -- 노동자 | 프리랜서 | 자영업자
  category text not null,              -- 임금 | 부당해고 | 노동환경·처우 | 산업재해 | 불법파견 | 위장도급 | 불공정계약 | 기술탈취 | 지식재산권 | 기타
  counterparty text,                   -- 상대방(기업)
  title text not null,
  content text not null,               -- 분쟁 상세 내용
  desired text,                        -- 희망 해결 방안
  attachments jsonb not null default '[]'::jsonb,  -- [{name,url}] 증빙 링크
  status text not null default 'submitted',        -- submitted|reviewing|assigned|in_progress|resolved|closed
  assignees jsonb not null default '[]'::jsonb,     -- [{role:'변호사',name:'홍길동'}]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) 단계별 진행 로그
create table if not exists mediation_steps (
  id uuid primary key default gen_random_uuid(),
  mediation_id uuid not null references mediations(id) on delete cascade,
  step_no int not null default 1,
  title text not null,                 -- 단계명 (접수 검토 / 전문가 배정 / 1차 조정 / 합의안 도출 등)
  note text,                           -- 진행 안내
  status text,                         -- 단계 적용 상태
  created_at timestamptz not null default now()
);

alter table mediations enable row level security;
alter table mediation_steps enable row level security;

-- 의뢰: 본인 조회 / 관리자 전체
drop policy if exists med_select on mediations;
create policy med_select on mediations for select to authenticated
  using (requester_id = auth.uid() or is_admin_user());

drop policy if exists med_insert on mediations;
create policy med_insert on mediations for insert to authenticated
  with check (requester_id = auth.uid());

drop policy if exists med_update on mediations;
create policy med_update on mediations for update to authenticated
  using (is_admin_user()) with check (is_admin_user());

-- 단계: 의뢰자 본인/관리자 조회, 관리자만 작성
drop policy if exists medstep_select on mediation_steps;
create policy medstep_select on mediation_steps for select to authenticated
  using (is_admin_user() or exists (select 1 from mediations m where m.id = mediation_id and m.requester_id = auth.uid()));

drop policy if exists medstep_insert on mediation_steps;
create policy medstep_insert on mediation_steps for insert to authenticated
  with check (is_admin_user());

-- 3) 접수 시: 관리자 알림(mediation_admin) + 의뢰자 접수 확인 알림(mediation)
create or replace function notify_on_mediation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- 관리자에게 접수 알림
  insert into notifications (user_id, type, actor_name, body, data, read)
  select p.id, 'mediation_admin', NEW.requester_name,
         '새 분쟁 조정 의뢰: [' || NEW.category || '] ' || NEW.title,
         jsonb_build_object('mediation_id', NEW.id), false
  from profiles p
  where p.is_admin = true or p.email = 'tony@banya.ai';

  -- 의뢰자에게 접수 확인 알림
  insert into notifications (user_id, type, actor_name, body, data, read)
  values (NEW.requester_id, 'mediation', '협동조합 분쟁조정위원회',
          '분쟁 조정 의뢰가 정상 접수되었습니다: ' || NEW.title || '. 조합이 검토 후 변호사·변리사·전문가를 배정해 조정을 시작합니다.',
          jsonb_build_object('mediation_id', NEW.id), false);
  return NEW;
end;
$$;

drop trigger if exists trg_notify_mediation on mediations;
create trigger trg_notify_mediation after insert on mediations
for each row execute function notify_on_mediation();

-- 4) 단계 진행(관리자): 상태/배정 갱신 + 단계 로그 + 의뢰자 알림 + 발송 메시지 반환
create or replace function advance_mediation(
  p_id uuid,
  p_status text,
  p_step_title text,
  p_note text default null,
  p_assignees jsonb default null
) returns text language plpgsql security definer set search_path = public as $$
declare m record; msg text; nextno int;
begin
  if not is_admin_user() then raise exception '권한이 없습니다.'; end if;
  select * into m from mediations where id = p_id;
  if not found then raise exception '의뢰를 찾을 수 없습니다.'; end if;

  update mediations
     set status = coalesce(p_status, status),
         assignees = coalesce(p_assignees, assignees),
         updated_at = now()
   where id = p_id;

  select coalesce(max(step_no), 0) + 1 into nextno from mediation_steps where mediation_id = p_id;
  insert into mediation_steps (mediation_id, step_no, title, note, status)
  values (p_id, nextno, p_step_title, p_note, p_status);

  msg := '[분쟁 조정 진행 안내] 「' || coalesce(m.title, '분쟁 조정') || '」 의뢰의 진행 상황이 갱신되었습니다.' || chr(10)
       || '· 단계: ' || p_step_title || chr(10)
       || coalesce('· 안내: ' || p_note || chr(10), '')
       || '· 현재 상태: ' || coalesce(p_status, m.status);

  insert into notifications (user_id, type, actor_name, body, data, read)
  values (m.requester_id, 'mediation', '협동조합 분쟁조정위원회', msg,
          jsonb_build_object('mediation_id', p_id), false);

  return msg;
end;
$$;

-- 5) 분쟁 조정 의뢰 시 1000 coin 차감 (부족 시 의뢰 불가)
create or replace function charge_coins_on_mediation()
returns trigger language plpgsql security definer set search_path = public as $$
declare bal numeric;
begin
  select coins into bal from profiles where id = NEW.requester_id;
  if coalesce(bal, 0) < 1000 then
    raise exception '코인이 부족합니다. 분쟁 조정 의뢰에는 1000 coin이 필요합니다. (보유: % coin)', coalesce(bal, 0);
  end if;
  update profiles set coins = coins - 1000 where id = NEW.requester_id;
  insert into coin_transactions (user_id, amount, reason)
  values (NEW.requester_id, -1000, '분쟁 조정 의뢰');
  return NEW;
end;
$$;
drop trigger if exists trg_charge_mediation on mediations;
create trigger trg_charge_mediation before insert on mediations
for each row execute function charge_coins_on_mediation();
