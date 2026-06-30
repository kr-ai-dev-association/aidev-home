import React, { useEffect, useState, useCallback } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';
import { startConversation } from '../lib/inbox';
import { useI18n } from '../i18n/I18nProvider';

const STATUS = {
  new: { labelKey: 'jobsMgmt.statusNew', color: '#67e8f9' },
  reviewing: { labelKey: 'jobsMgmt.statusReviewing', color: '#fcd34d' },
  accepted: { labelKey: 'jobsMgmt.statusAccepted', color: '#4ade80' },
  rejected: { labelKey: 'jobsMgmt.statusRejected', color: '#fca5a5' },
};

function fmt(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function MyJobsPage({ user, isLoggedIn, onOpenConversation, onNavigate, onViewProfile }) {
  const { t } = useI18n();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data: js } = await supabase.from('jobs').select('*').eq('author_id', user.id).order('created_at', { ascending: false });
    const list = js || [];
    setJobs(list);
    if (list.length) {
      const { data: ap } = await supabase
        .from('job_applications')
        .select('*')
        .in('job_id', list.map((j) => j.id))
        .order('created_at', { ascending: false });
      setApps(ap || []);
    } else {
      setApps([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (app, status) => {
    setBusy(app.id);
    const { error } = await supabase.from('job_applications').update({ status }).eq('id', app.id);
    setBusy(null);
    if (error) { alert(t('jobsMgmt.statusErr', { msg: error.message })); return; }
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
  };

  const assignContractor = async (job, app) => {
    if (!window.confirm(t('jobsMgmt.assignConfirm', { name: app.applicant_name || t('jobsMgmt.assignConfirmFallbackName') }))) return;
    setBusy(app.id);
    const { error } = await supabase.from('jobs').update({ contractor_id: app.applicant_id, closed: true }).eq('id', job.id);
    if (!error) await supabase.from('job_applications').update({ status: 'accepted' }).eq('id', app.id);
    setBusy(null);
    if (error) { alert(t('jobsMgmt.closeErr', { msg: error.message })); return; }
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, contractor_id: app.applicant_id, closed: true } : j)));
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: 'accepted' } : a)));
  };

  const toggleClose = async (job) => {
    const next = !job.closed;
    if (next && !window.confirm(t('jobsMgmt.closeConfirm'))) return;
    const patch = next ? { closed: true, closed_at: new Date().toISOString() } : { closed: false, closed_at: null };
    setBusy(job.id);
    const { error } = await supabase.from('jobs').update(patch).eq('id', job.id);
    setBusy(null);
    if (error) { alert(t('jobsMgmt.statusErr', { msg: error.message })); return; }
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...patch } : j)));
  };

  const dm = async (applicantId) => {
    try {
      const cid = await startConversation(applicantId);
      onOpenConversation && onOpenConversation(cid);
    } catch (e) { alert(t('jobsMgmt.messageErr', { msg: e.message })); }
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>{t('jobsMgmt.loginRequiredTitle')}</h3>
            <p className="section-lead">{t('jobsMgmt.myJobsLoginLead')}</p>
          </section>
        </div>
      </div>
    );
  }

  const appsOf = (jobId) => apps.filter((a) => a.job_id === jobId);

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>{t('jobsMgmt.myJobsTitle')}</h3>
          <p className="section-lead">{t('jobsMgmt.myJobsLead')}</p>

          {loading ? (
            <p className="admin-msg">{t('jobsMgmt.loading')}</p>
          ) : jobs.length === 0 ? (
            <p className="admin-msg">{t('jobsMgmt.noJobs')}</p>
          ) : (
            <div className="myjobs-list">
              {jobs.map((job) => {
                const list = appsOf(job.id);
                const open = openId === job.id;
                return (
                  <div className="myjob-card" key={job.id}>
                    <div className="myjob-head" onClick={() => setOpenId(open ? null : job.id)}>
                      <div>
                        <span className="b2b-type-pill">{job.board_type}</span>
                        <span className={`job-status ${job.closed ? 'closed' : 'open'}`} style={{ marginLeft: 8 }}>
                          {job.closed ? t('jobsMgmt.closed') : t('jobsMgmt.open')}
                        </span>
                        <h4>{job.title}</h4>
                        {job.board_type === '외주 프로젝트' && job.deadline && (
                          <span className="myjob-deadline">{t('jobsMgmt.deadlineLabel', { date: fmt(job.deadline) })}{!job.closed && new Date(job.deadline) < new Date() ? t('jobsMgmt.deadlinePassed') : ''}</span>
                        )}
                        {job.board_type === '외주 프로젝트' && job.contractor_id && (
                          <span className="myjob-contractor">{t('jobsMgmt.contractorAssigned')}</span>
                        )}
                      </div>
                      <div className="myjob-head-actions">
                        {/* 외주는 계약자 지정(아래)으로 마감, 채용·프로젝트 구인은 직접 마감/재개시 */}
                        {job.board_type !== '외주 프로젝트' && (
                          <button type="button" className={`b2b-status-btn ${job.closed ? '' : 'contract'}`} disabled={busy === job.id}
                            onClick={(e) => { e.stopPropagation(); toggleClose(job); }}>
                            {job.closed ? t('jobsMgmt.reopen') : t('jobsMgmt.close')}
                          </button>
                        )}
                        <span className="myjob-count">{t('jobsMgmt.applyCount', { count: list.length })}<span className="myjob-caret">{open ? '▴' : '▾'}</span></span>
                      </div>
                    </div>

                    {open && (
                      <div className="myjob-apps">
                        {!job.platform_apply && (
                          <p className="myjob-note">{t('jobsMgmt.platformOff')}</p>
                        )}
                        {list.length === 0 ? (
                          <p className="myjob-note">{t('jobsMgmt.noApplicants')}</p>
                        ) : (
                          list.map((a) => {
                            const st = STATUS[a.status] || STATUS.new;
                            const p = a.profile || {};
                            return (
                              <div className="apply-card" key={a.id}>
                                <div className="apply-card-top">
                                  <button type="button" className="apply-name-btn" onClick={() => onViewProfile && onViewProfile(a.applicant_id, { ...p, name: a.applicant_name || p.name })} title={t('jobsMgmt.viewApplicantProfile')}>
                                    {a.applicant_name || p.name || t('jobsMgmt.applicantFallback')}
                                  </button>
                                  {p.main_title && <span className="apply-title">{p.main_title}</span>}
                                  <span className="b2b-status" style={{ color: st.color, borderColor: st.color, marginLeft: 'auto' }}>{t(st.labelKey)}</span>
                                  <span className="b2b-date">{fmt(a.created_at)}</span>
                                </div>
                                {Array.isArray(p.skills) && p.skills.length > 0 && (
                                  <div className="apply-skills">{p.skills.slice(0, 8).map((s, i) => <span className="apply-skill" key={i}>{s}</span>)}</div>
                                )}
                                <p className="apply-msg">{a.message}</p>
                                <p className="apply-contact">
                                  {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                                  {p.phone ? ` · ${p.phone}` : ''}
                                  {p.location ? ` · ${p.location}` : ''}
                                  {p.linkedin_url && <> · <a href={p.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a></>}
                                </p>
                                <div className="apply-actions-row">
                                  <button className="b2b-status-btn" onClick={() => dm(a.applicant_id)}>{t('jobsMgmt.message')}</button>
                                  {Object.entries(STATUS).map(([k, v]) => (
                                    <button key={k} className={`b2b-status-btn ${a.status === k ? 'active' : ''}`}
                                      disabled={busy === a.id || a.status === k} onClick={() => setStatus(a, k)}>{t(v.labelKey)}</button>
                                  ))}
                                  {job.board_type === '외주 프로젝트' && (
                                    job.contractor_id === a.applicant_id ? (
                                      <span className="contractor-badge">{t('jobsMgmt.contractorBadge')}</span>
                                    ) : !job.closed ? (
                                      <button className="b2b-status-btn contract" disabled={busy === a.id} onClick={() => assignContractor(job, a)}>
                                        {t('jobsMgmt.assignContractor')}
                                      </button>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyJobsPage;
