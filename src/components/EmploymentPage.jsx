import React, { useState, useEffect, useCallback } from 'react';
import './EmploymentPage.css';
import '../App.css';
import { supabase } from '../lib/supabase';
import JobDetailPage from './JobDetailPage';
import JobForm from './JobForm';
import { BOARD_TYPES, CORP_ONLY, badgeStyle, cardInfo } from '../lib/jobFields';

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

function JobCard({ job, onClick }) {
  const info = cardInfo(job);
  const st = badgeStyle(info.badge);
  const text = jobSnippet(job.description);
  const tech = info.tech || [];
  return (
    <div className={`job-card${job.closed ? ' job-card-closed' : ''}`} onClick={() => onClick(job)}>
      <div className="job-details">
        <div className="job-title-row">
          <span className={`job-status ${job.closed ? 'closed' : 'open'}`}>
            {job.closed ? '🔒 CLOSED' : '🟢 OPEN'}
          </span>
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

function EmploymentPage({ isLoggedIn, isAdmin, onNavigate, user, profile, onOpenConversation, initialJobId, onJobConsumed, onOpenSearch, onProfileChanged }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('전체');
  const [kw, setKw] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'form' | 'manage'
  const [editing, setEditing] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const isCorporate = profile?.account_type === 'corporate';
  const canPostCorp = isCorporate || isAdmin; // 채용공고/프로젝트 구인 작성 가능 여부

  const fetchJobs = useCallback(async () => {
    setLoading(true);
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
    if (next && !window.confirm('이 공고를 마감하시겠습니까? 목록에는 CLOSED로 계속 표시됩니다.')) return;
    const { error } = await supabase.from('jobs').update({ closed: next }).eq('id', job.id);
    if (error) { alert(`상태 변경 오류: ${error.message}`); return; }
    setSelectedJob((j) => (j && j.id === job.id ? { ...j, closed: next } : j));
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
            list.map((job) => <JobCard key={job.id} job={job} onClick={handleJobClick} />)
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
