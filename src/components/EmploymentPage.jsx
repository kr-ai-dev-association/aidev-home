import React, { useState, useEffect, useCallback } from 'react';
import './EmploymentPage.css';
import '../App.css';
import { supabase } from '../lib/supabase';
import JobDetailPage from './JobDetailPage';
import JobForm from './JobForm';
import { BOARD_TYPES, CORP_ONLY, badgeStyle, cardInfo } from '../lib/jobFields';
import { fetchMyScrapIds, addScrap, removeScrap } from '../lib/scraps';

const TABS = ['전체', ...BOARD_TYPES];

function jobSnippet(html) {
  let t = (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // 출처 안내 문구(큐레이션 보일러플레이트)는 미리보기에서 제외
  const idx = t.indexOf('공유합니다.');
  if (idx >= 0) t = t.slice(idx + '공유합니다.'.length).trim();
  return t;
}

function JobCard({ job, onClick, scrapped, onToggleScrap }) {
  const info = cardInfo(job);
  const st = badgeStyle(info.badge);
  const text = jobSnippet(job.description);
  const tech = info.tech || [];
  return (
    <div className={`job-card${job.closed ? ' job-card-closed' : ''}`} onClick={() => onClick(job)}>
      {onToggleScrap && (
        <button
          type="button"
          className={`scrap-btn${scrapped ? ' on' : ''}`}
          title={scrapped ? '스크랩 해제' : '스크랩'}
          aria-label={scrapped ? '스크랩 해제' : '스크랩'}
          onClick={(e) => { e.stopPropagation(); onToggleScrap(job); }}
        >
          {scrapped ? '🔖' : '🏷️'}
        </button>
      )}
      <div className="job-details">
        <div className="job-title-row">
          {/* 외주는 OPEN/CLOSED, 채용·프로젝트 구인은 마감 시에만 '마감' 배지 */}
          {job.board_type === '외주 프로젝트' ? (
            <span className={`job-status ${job.closed ? 'closed' : 'open'}`}>
              {job.closed ? '🔒 CLOSED' : '🟢 OPEN'}
            </span>
          ) : job.closed ? (
            <span className="job-status closed">🔒 마감</span>
          ) : null}
          <h3 className="job-title">{job.title}</h3>
          <div className="job-type" style={{ backgroundColor: st.bg, color: st.color }}>{info.badge}</div>
        </div>
        {info.company && <p className="job-company">{info.company}</p>}
        <div className="job-meta">
          {info.location && <span className="job-meta-item">📍 {info.location}</span>}
          {(info.meta || []).map((m, i) => <span className="job-meta-item" key={i}>{m}</span>)}
        </div>
        {tech.length > 0 && (
          <div className="job-tech">
            {tech.slice(0, 6).map((t, i) => <span className="job-tech-chip" key={i}>{t}</span>)}
            {tech.length > 6 && <span className="job-tech-chip more">+{tech.length - 6}</span>}
          </div>
        )}
        {text && <p className="job-snippet">{text.slice(0, 140)}{text.length > 140 ? '…' : ''}</p>}
      </div>
    </div>
  );
}

function EmploymentPage({ isLoggedIn, isAdmin, isMember, onNavigate, user, profile, onOpenConversation, initialJobId, onJobConsumed, onOpenSearch, onProfileChanged }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('전체');
  const [kw, setKw] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'form' | 'manage'
  const [editing, setEditing] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [scrapIds, setScrapIds] = useState(() => new Set());

  // 내 스크랩 목록 로드
  useEffect(() => {
    let active = true;
    (async () => {
      if (!user?.id) { setScrapIds(new Set()); return; }
      const ids = await fetchMyScrapIds(user.id);
      if (active) setScrapIds(new Set(ids));
    })();
    return () => { active = false; };
  }, [user]);

  const toggleScrap = async (job) => {
    if (!user?.id) { alert('스크랩은 로그인 후 이용할 수 있습니다.'); return; }
    const has = scrapIds.has(job.id);
    setScrapIds((prev) => { const n = new Set(prev); if (has) n.delete(job.id); else n.add(job.id); return n; }); // 낙관적 갱신
    const { error } = has ? await removeScrap(user.id, job.id) : await addScrap(user.id, job.id);
    if (error) {
      setScrapIds((prev) => { const n = new Set(prev); if (has) n.add(job.id); else n.delete(job.id); return n; }); // 롤백
      alert(`스크랩 오류: ${error.message}`);
    }
  };

  const isCorporate = profile?.account_type === 'corporate';
  const canPostCorp = isCorporate || isAdmin; // 채용공고/프로젝트 구인 작성 가능 여부

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    // 자동 정리(서버 함수): 기한 지난 미마감 외주 + 마감 1개월 경과 채용·프로젝트 구인
    try { await supabase.rpc('purge_expired_jobs'); } catch { /* 미배포 시 외주 정리만 폴백 */
      try { await supabase.rpc('purge_expired_outsource_jobs'); } catch { /* noop */ }
    }
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // 검색 결과에서 특정 공고로 바로 진입
  useEffect(() => {
    if (initialJobId && jobs.length) {
      const j = jobs.find((x) => x.id === initialJobId);
      if (j) { setSelectedJob(j); setView('list'); window.scrollTo({ top: 0 }); }
      onJobConsumed && onJobConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialJobId, jobs]);

  // 공유용 URL 동기화(공고 상세 진입/이탈 시 주소 반영)
  useEffect(() => {
    const path = selectedJob ? `/employment/job/${selectedJob.id}` : '/employment';
    if (window.location.pathname !== path) window.history.replaceState(null, '', path);
  }, [selectedJob]);

  const handleJobClick = (job) => {
    if (!isLoggedIn) {
      alert('로그인해야 채용 상세 정보를 볼 수 있습니다.');
      onNavigate('login');
      return;
    }
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    if (!isLoggedIn) {
      alert('로그인 후 공고를 등록할 수 있습니다.');
      onNavigate('login');
      return;
    }
    setEditing(null);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (job) => {
    setSelectedJob(null);
    setEditing(job);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (job) => {
    if (!window.confirm('이 공고를 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', job.id);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setSelectedJob(null);
    fetchJobs();
  };

  const handleSaved = () => {
    setView('list');
    setEditing(null);
    fetchJobs();
    onProfileChanged?.(); // 차감된 coin 반영
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedJob(null);
    fetchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 공고 마감/마감취소 (작성자·관리자)
  const toggleClose = async (job) => {
    const next = !job.closed;
    // 외주 프로젝트는 계약자 지정으로만 마감 가능 (직접 마감 차단)
    if (next && job.board_type === '외주 프로젝트') {
      alert('외주 프로젝트는 ‘내 공고 관리’에서 지원자 중 계약자를 지정해야 마감됩니다.\n계약 없이 종료하려면 공고를 삭제해 주세요.');
      return;
    }
    if (next && !window.confirm('이 공고를 마감하시겠습니까?\n목록에는 마감으로 계속 표시되며, 채용·프로젝트 구인은 마감 1개월 후 자동 삭제됩니다.\n기간을 수정하면 다시 재개시할 수 있습니다.')) return;
    // 마감 시 closed_at 기록(1개월 자동삭제 기준) / 재오픈 시 해제, 외주는 계약자도 해제
    const patch = next
      ? { closed: true, closed_at: new Date().toISOString() }
      : { closed: false, closed_at: null, ...(job.board_type === '외주 프로젝트' ? { contractor_id: null } : {}) };
    const { error } = await supabase.from('jobs').update(patch).eq('id', job.id);
    if (error) { alert(`상태 변경 오류: ${error.message}`); return; }
    setSelectedJob((j) => (j && j.id === job.id ? { ...j, ...patch } : j));
    fetchJobs();
  };

  // 상세
  if (selectedJob) {
    return (
      <JobDetailPage
        job={selectedJob}
        allJobs={jobs}
        onBack={handleBack}
        onSelect={handleJobClick}
        canManage={isAdmin || selectedJob.author_id === user?.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleClose={toggleClose}
        canMessage={isLoggedIn && selectedJob.author_id !== user?.id}
        onOpenConversation={onOpenConversation}
        scrapped={scrapIds.has(selectedJob.id)}
        onToggleScrap={isLoggedIn ? toggleScrap : undefined}
        isMember={isMember}
        isAdmin={isAdmin}
        user={user}
        profile={profile}
      />
    );
  }

  // 등록/수정 폼
  if (view === 'form') {
    return (
      <div className="employment-page-container content-area-container">
        <JobForm
          initial={editing}
          canPostCorp={canPostCorp}
          user={user}
          profile={profile}
          onSaved={handleSaved}
          onCancel={() => { setView('list'); setEditing(null); }}
        />
      </div>
    );
  }

  // 목록 필터 — 내 공고(manage)는 보드 탭과 무관하게 내가 등록한 전체 공고 표시
  let list;
  if (view === 'manage') {
    list = jobs.filter((j) => j.author_id === user?.id);
  } else {
    list = tab === '전체' ? jobs : jobs.filter((j) => j.board_type === tab);
  }
  if (kw.trim()) {
    const q = kw.toLowerCase();
    list = list.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      JSON.stringify(j.details || {}).toLowerCase().includes(q)
    );
  }

  const myCount = jobs.filter((j) => j.author_id === user?.id).length;

  return (
    <div className="employment-page-container content-area-container">
      <div className="emp-fee-banner">
        <div className="emp-fee-glow" aria-hidden="true" />
        <div className="emp-fee-icon-chip" aria-hidden="true">🤝</div>
        <div className="emp-fee-content">
          <div className="emp-fee-headline">
            <span className="emp-fee-badge">중계 수수료 0%</span>
            <h3>조합원을 위한, 수수료 없는 매칭</h3>
          </div>
          <p>
            조합은 조합원 간의 <strong>채용·프로젝트 구인·외주 업무</strong>에 대해 <strong>어떠한 중계 수수료도 받지 않습니다.</strong>
            모든 플랫폼 기능은 <strong>조합원의 회비</strong>와 <strong>조합의 수익 사업</strong>으로 운영됩니다.
          </p>
        </div>
      </div>
      <div className="employment-header">
        <div className="employment-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab-button ${view === 'list' && tab === t ? 'active' : ''}`}
              onClick={() => { setTab(t); setView('list'); }}
            >
              {t}
            </button>
          ))}
          {isLoggedIn && (
            <button className={`tab-button ${view === 'manage' ? 'active' : ''}`} onClick={() => setView('manage')}>
              내 공고({myCount})
            </button>
          )}
          <button className="new-topic-button" onClick={handleNew}>+ 공고 등록</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="키워드 (Enter로 통합 검색)"
            className="search-input"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenSearch && onOpenSearch('job', kw); }}
          />
          <button className="search-button" aria-label="검색" onClick={() => onOpenSearch && onOpenSearch('job', kw)}>
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </div>

      <div className="employment-main-content">
        <div className="job-listings">
          {loading ? (
            <p className="community-msg">불러오는 중...</p>
          ) : list.length === 0 ? (
            <p className="community-msg">
              {view === 'manage' ? '등록한 공고가 없습니다.' : '등록된 공고가 없습니다. 첫 공고를 등록해보세요!'}
            </p>
          ) : (
            list.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={handleJobClick}
                scrapped={scrapIds.has(job.id)}
                onToggleScrap={isLoggedIn ? toggleScrap : undefined}
              />
            ))
          )}
        </div>

        <aside className="employment-sidebar">
          <div className="featured-jobs-section">
            <h3>최근 공고</h3>
            <div className="featured-jobs-list">
              {jobs.slice(0, 5).map((job) => {
                const info = cardInfo(job);
                const st = badgeStyle(info.badge);
                return (
                  <div key={job.id} className="featured-job-card" onClick={() => handleJobClick(job)}>
                    <div className="featured-job-details">
                      <h4 className="featured-job-title">{job.title}</h4>
                      <div className="featured-job-type" style={{ backgroundColor: st.bg, color: st.color }}>{info.badge}</div>
                    </div>
                  </div>
                );
              })}
              {jobs.length === 0 && <p className="community-msg" style={{ padding: '1rem 0' }}>공고 없음</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EmploymentPage;
