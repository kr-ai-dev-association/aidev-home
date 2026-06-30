import React, { useEffect, useState, useCallback } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';
import { badgeStyle } from '../lib/jobFields';

const STATUS = {
  new: { label: '검토 대기', color: '#67e8f9' },
  reviewing: { label: '검토 중', color: '#fcd34d' },
  accepted: { label: '합격', color: '#4ade80' },
  rejected: { label: '불합격', color: '#fca5a5' },
};

function fmt(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function MyApplicationsPage({ user, isLoggedIn, onOpenJob }) {
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
    if (!window.confirm('스크랩을 삭제하시겠습니까?')) return;
    setBusy(row.id);
    const { error } = await supabase.from('job_scraps').delete().eq('id', row.id);
    setBusy(null);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setScraps((prev) => prev.filter((r) => r.id !== row.id));
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>로그인이 필요합니다</h3>
            <p className="section-lead">스크랩한 공고와 지원 현황은 로그인 후 확인할 수 있습니다.</p>
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
            {job.closed && <span className="job-status closed" style={{ marginLeft: 8 }}>🔒 마감</span>}
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
          <h3>내 지원 관리</h3>
          <p className="section-lead">스크랩한 공고와 내가 지원한 현황을 확인합니다.</p>

          <div className="myapp-tabs">
            <button className={`tab-button ${tab === 'scraps' ? 'active' : ''}`} onClick={() => setTab('scraps')}>
              스크랩한 공고 ({scraps.length})
            </button>
            <button className={`tab-button ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
              지원 현황 ({apps.length})
            </button>
          </div>

          {loading ? (
            <p className="admin-msg">불러오는 중...</p>
          ) : tab === 'scraps' ? (
            scraps.length === 0 ? (
              <p className="admin-msg">스크랩한 공고가 없습니다. 취업 페이지에서 🏷️ 버튼으로 공고를 스크랩해보세요.</p>
            ) : (
              <div className="myjobs-list">
                {scraps.map((row) => renderJobRow(
                  row.jobs,
                  <span className="myjob-deadline">스크랩 {fmt(row.created_at)}</span>,
                  <button
                    type="button"
                    className="b2b-status-btn"
                    disabled={busy === row.id}
                    onClick={(e) => { e.stopPropagation(); removeScrap(row); }}
                  >🗑️ 삭제</button>,
                ))}
              </div>
            )
          ) : (
            apps.length === 0 ? (
              <p className="admin-msg">지원한 공고가 없습니다.</p>
            ) : (
              <div className="myjobs-list">
                {apps.map((row) => {
                  const stt = STATUS[row.status] || STATUS.new;
                  return renderJobRow(
                    row.jobs,
                    <>
                      <span className="myjob-deadline">지원 {fmt(row.created_at)}</span>
                      {row.message && <p className="apply-msg" style={{ marginTop: '0.5rem' }}>{row.message}</p>}
                    </>,
                    <span className="b2b-status" style={{ color: stt.color, borderColor: stt.color, whiteSpace: 'nowrap' }}>{stt.label}</span>,
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
