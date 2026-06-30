-- 지원 시 공고 작성자에게 알림 푸시
--   · notifications 컬럼: (user_id, type, actor_name, body, data, read)
--   · 알림 클릭 시 프런트가 '내 공고 관리(myjobs)' 로 이동 (InboxPage onNavigate)

-- 1) 지원 INSERT 트리거: 공고 작성자에게 알림 생성
create or replace function notify_owner_on_application()
returns trigger language plpgsql security definer set search_path = public as $$
declare j record;
begin
  select author_id, title, board_type into j from jobs where id = NEW.job_id;
  if j.author_id is not null and j.author_id <> NEW.applicant_id then
    insert into notifications (user_id, type, actor_name, body, data, read)
    values (
      j.author_id,
      'application',
      coalesce(NEW.applicant_name, '지원자'),
      coalesce(NEW.applicant_name, '지원자') || '님이 「' || coalesce(j.title, '공고') || '」에 지원했습니다.'
        || case when NEW.message is not null and length(trim(NEW.message)) > 0
                then ' — ' || left(NEW.message, 60) || case when length(NEW.message) > 60 then '…' else '' end
                else '' end,
      jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id, 'board_type', j.board_type),
      false
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_notify_application on job_applications;
create trigger trg_notify_application after insert on job_applications
for each row execute function notify_owner_on_application();

-- 2) 기존 지원건 백필: 트리거 생성 이전에 들어온 지원에 대해 누락된 알림 보충
insert into notifications (user_id, type, actor_name, body, data, read)
select
  j.author_id,
  'application',
  coalesce(a.applicant_name, '지원자'),
  coalesce(a.applicant_name, '지원자') || '님이 「' || coalesce(j.title, '공고') || '」에 지원했습니다.'
    || case when a.message is not null and length(trim(a.message)) > 0
            then ' — ' || left(a.message, 60) || case when length(a.message) > 60 then '…' else '' end
            else '' end,
  jsonb_build_object('job_id', a.job_id, 'application_id', a.id, 'board_type', j.board_type),
  false
from job_applications a
join jobs j on j.id = a.job_id
where j.author_id is not null
  and j.author_id <> a.applicant_id
  and not exists (
    select 1 from notifications n
    where n.user_id = j.author_id
      and n.type = 'application'
      and n.data->>'application_id' = a.id::text
  );
