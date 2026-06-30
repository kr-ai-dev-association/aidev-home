import React, { useEffect, useState, useCallback } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';
import { startConversation } from '../lib/inbox';

const STATUS = {
  new: { label: '신규', color: '#67e8f9' },
  reviewing: { label: '검토 중', color: '#fcd34d' },
  accepted: { label: '합격', color: '#4ade80' },
  rejected: { label: '불합격', color: '#fca5a5' },
};

function fmt(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function MyJobsPage({ user, isLoggedIn, onOpenConversation, onNavigate, onViewProfile }) {
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
    if (error) { alert(`상태 변경 오류: ${error.message}`); return; }
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
  };

  const assignContractor = async (job, app) => {
    if (!window.confirm(`${app.applicant_name || '이 지원자'}님을 계약자로 지정하고 공고를 마감하시겠습니까?\n마감 후에는 더 이상 지원을 받지 않습니다.`)) return;
    setBusy(app.id);
    const { error } = await supabase.from('jobs').update({ contractor_id: app.applicant_id, closed: true }).eq('id', job.id);
    if (!error) await supabase.from('job_applications').update({ status: 'accepted' }).eq('id', app.id);
    setBusy(null);
    if (error) { alert(`마감 오류: ${error.message}`); return; }
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, contractor_id: app.applicant_id, closed: true } : j)));
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: 'accepted' } : a)));
  };

  const toggleClose = async (job) => {
    const next = !job.closed;
    if (next && !window.confirm('이 공고를 마감하시겠습니까?\n목록에는 마감으로 표시되며, 마감 1개월 후 자동 삭제됩니다.\n수정에서 다시 재개시할 수 있습니다.')) return;
    const patch = next ? { closed: true, closed_at: new Date().toISOString() } : { closed: false, closed_at: null };
    setBusy(job.id);
    const { error } = await supabase.from('jobs').update(patch).eq('id', job.id);
    setBusy(null);
    if (error) { alert(`상태 변경 오류: ${error.message}`); return; }
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...patch } : j)));
  };

  const dm = async (applicantId) => {
    try {
      const cid = await startConversation(applicantId);
      onOpenConversation && onOpenConversation(cid);
    } catch (e) { alert(`메시지 오류: ${e.message}`); }
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>로그인이 필요합니다</h3>
            <p className="section-lead">내 공고와 지원 현황은 로그인 후 확인할 수 있습니다.</p>
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
          <h3>내 공고 관리</h3>
          <p className="section-lead">내가 등록한 공고와 지원자 현황을 확인하고 처리 상태를 관리합니다.</p>

          {loading ? (
            <p className="admin-msg">불러오는 중...</p>
          ) : jobs.length === 0 ? (
            <p className="admin-msg">등록한 공고가 없습니다. 취업 페이지에서 공고를 등록해보세요.</p>
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
                          {job.closed ? '🔒 CLOSED' : '🟢 OPEN'}
                        </span>
                        <h4>{job.title}</h4>
                        {job.board_type === '외주 프로젝트' && job.deadline && (
                          <span className="myjob-deadline">마감 기한 {fmt(job.deadline)}{!job.closed && new Date(job.deadline) < new Date() ? ' · ⚠️ 기한 경과(자동 삭제 대상)' : ''}</span>
                        )}
                        {job.board_type === '외주 프로젝트' && job.contractor_id && (
                          <span className="myjob-contractor">✅ 계약자 지정 완료</span>
                        )}
                      </div>
                      <div className="myjob-head-actions">
                        {/* 외주는 계약자 지정(아래)으로 마감, 채용·프로젝트 구인은 직접 마감/재개시 */}
                        {job.board_type !== '외주 프로젝트' && (
                          <button type="button" className={`b2b-status-btn ${job.closed ? '' : 'contract'}`} disabled={busy === job.id}
                            onClick={(e) => { e.stopPropagation(); toggleClose(job); }}>
                            {job.closed ? '🔓 재개시' : '🔒 마감'}
                          </button>
                        )}
                        <span className="myjob-count">지원 {list.length}건 <span className="myjob-caret">{open ? '▴' : '▾'}</span></span>
                      </div>
                    </div>

                    {open && (
                      <div className="myjob-apps">
                        {!job.platform_apply && (
                          <p className="myjob-note">이 공고는 ‘플랫폼 지원받기’가 꺼져 있습니다. 공고 수정에서 켜면 지원을 받을 수 있습니다.</p>
                        )}
                        {list.length === 0 ? (
                          <p className="myjob-note">아직 지원자가 없습니다.</p>
                        ) : (
                          list.map((a) => {
                            const st = STATUS[a.status] || STATUS.new;
                            const p = a.profile || {};
                            return (
                              <div className="apply-card" key={a.id}>
                                <div className="apply-card-top">
                                  <button type="button" className="apply-name-btn" onClick={() => onViewProfile && onViewProfile(a.applicant_id, { ...p, name: a.applicant_name || p.name })} title="지원자 프로필 보기">
                                    {a.applicant_name || p.name || '지원자'}
                                  </button>
                                  {p.main_title && <span className="apply-title">{p.main_title}</span>}
                                  <span className="b2b-status" style={{ color: st.color, borderColor: st.color, marginLeft: 'auto' }}>{st.label}</span>
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
                                  <button className="b2b-status-btn" onClick={() => dm(a.applicant_id)}>✉️ 메시지</button>
                                  {Object.entries(STATUS).map(([k, v]) => (
                                    <button key={k} className={`b2b-status-btn ${a.status === k ? 'active' : ''}`}
                                      disabled={busy === a.id || a.status === k} onClick={() => setStatus(a, k)}>{v.label}</button>
                                  ))}
                                  {job.board_type === '외주 프로젝트' && (
                                    job.contractor_id === a.applicant_id ? (
                                      <span className="contractor-badge">🏆 계약자</span>
                                    ) : !job.closed ? (
                                      <button className="b2b-status-btn contract" disabled={busy === a.id} onClick={() => assignContractor(job, a)}>
                                        🏆 계약자 지정 & 마감
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
