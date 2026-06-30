import React, { useEffect, useState, useCallback } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';
import { badgeStyle } from '../lib/jobFields';
import { useI18n } from '../i18n/I18nProvider';

const STATUS = {
  new: { labelKey: 'jobsMgmt.statusNewPending', color: '#67e8f9' },
  reviewing: { labelKey: 'jobsMgmt.statusReviewing', color: '#fcd34d' },
  accepted: { labelKey: 'jobsMgmt.statusAccepted', color: '#4ade80' },
  rejected: { labelKey: 'jobsMgmt.statusRejected', color: '#fca5a5' },
};

function fmt(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function MyApplicationsPage({ user, isLoggedIn, onOpenJob }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('scraps'); // 'scraps' | 'applications'
  const [scraps, setScraps] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const [{ data: sc }, { data: ap }] = await Promise.all([
      supabase
        .from('job_scraps')
        .select('id, job_id, created_at, jobs(id, title, board_type, closed)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('job_applications')
        .select('id, job_id, status, message, created_at, jobs(id, title, board_type, closed)')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false }),
    ]);
    setScraps((sc || []).filter((r) => r.jobs)); // 삭제된 공고 제외
    setApps((ap || []).filter((r) => r.jobs));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const removeScrap = async (row) => {
    if (!window.confirm(t('jobsMgmt.removeScrapConfirm'))) return;
    setBusy(row.id);
    const { error } = await supabase.from('job_scraps').delete().eq('id', row.id);
    setBusy(null);
    if (error) { alert(t('jobsMgmt.deleteErr', { msg: error.message })); return; }
    setScraps((prev) => prev.filter((r) => r.id !== row.id));
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>{t('jobsMgmt.loginRequiredTitle')}</h3>
            <p className="section-lead">{t('jobsMgmt.myAppsLoginLead')}</p>
          </section>
        </div>
      </div>
    );
  }

  const renderJobRow = (job, extra, actions) => {
    const st = badgeStyle(job.board_type);
    return (
      <div className="myjob-card">
        <div className="myjob-head" onClick={() => onOpenJob && onOpenJob(job.id)} style={{ cursor: 'pointer' }}>
          <div>
            <span className="b2b-type-pill" style={{ background: st.bg, color: st.color }}>{job.board_type}</span>
            {job.closed && <span className="job-status closed" style={{ marginLeft: 8 }}>{t('jobsMgmt.closedShort')}</span>}
            <h4>{job.title}</h4>
            {extra}
          </div>
          {actions}
        </div>
      </div>
    );
  };

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>{t('jobsMgmt.myAppsTitle')}</h3>
          <p className="section-lead">{t('jobsMgmt.myAppsLead')}</p>

          <div className="myapp-tabs">
            <button className={`tab-button ${tab === 'scraps' ? 'active' : ''}`} onClick={() => setTab('scraps')}>
              {t('jobsMgmt.tabScraps', { count: scraps.length })}
            </button>
            <button className={`tab-button ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
              {t('jobsMgmt.tabApplications', { count: apps.length })}
            </button>
          </div>

          {loading ? (
            <p className="admin-msg">{t('jobsMgmt.loading')}</p>
          ) : tab === 'scraps' ? (
            scraps.length === 0 ? (
              <p className="admin-msg">{t('jobsMgmt.noScraps')}</p>
            ) : (
              <div className="myjobs-list">
                {scraps.map((row) => renderJobRow(
                  row.jobs,
                  <span className="myjob-deadline">{t('jobsMgmt.scrapDate', { date: fmt(row.created_at) })}</span>,
                  <button
                    type="button"
                    className="b2b-status-btn"
                    disabled={busy === row.id}
                    onClick={(e) => { e.stopPropagation(); removeScrap(row); }}
                  >{t('jobsMgmt.delete')}</button>,
                ))}
              </div>
            )
          ) : (
            apps.length === 0 ? (
              <p className="admin-msg">{t('jobsMgmt.noApplications')}</p>
            ) : (
              <div className="myjobs-list">
                {apps.map((row) => {
                  const stt = STATUS[row.status] || STATUS.new;
                  return renderJobRow(
                    row.jobs,
                    <>
                      <span className="myjob-deadline">{t('jobsMgmt.applyDate', { date: fmt(row.created_at) })}</span>
                      {row.message && <p className="apply-msg" style={{ marginTop: '0.5rem' }}>{row.message}</p>}
                    </>,
                    <span className="b2b-status" style={{ color: stt.color, borderColor: stt.color, whiteSpace: 'nowrap' }}>{t(stt.labelKey)}</span>,
                  );
                })}
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}

export default MyApplicationsPage;
