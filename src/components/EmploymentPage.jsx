import React, { useState, useEffect, useCallback } from 'react';
import './EmploymentPage.css';
import '../App.css';
import { useI18n } from '../i18n/I18nProvider';
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
  const { t } = useI18n();
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
          title={scrapped ? t('employment.scrapOn') : t('employment.scrap')}
          aria-label={scrapped ? t('employment.scrapOn') : t('employment.scrap')}
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
              {job.closed ? t('employment.statusClosed') : t('employment.statusOpen')}
            </span>
          ) : job.closed ? (
            <span className="job-status closed">{t('employment.statusDeadline')}</span>
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
  const { t } = useI18n();
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
    if (!user?.id) { alert(t('employment.alertScrapLogin')); return; }
    const has = scrapIds.has(job.id);
    setScrapIds((prev) => { const n = new Set(prev); if (has) n.delete(job.id); else n.add(job.id); return n; }); // 낙관적 갱신
    const { error } = has ? await removeScrap(user.id, job.id) : await addScrap(user.id, job.id);
    if (error) {
      setScrapIds((prev) => { const n = new Set(prev); if (has) n.add(job.id); else n.delete(job.id); return n; }); // 롤백
      alert(t('employment.alertScrapError', { message: error.message }));
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
      alert(t('employment.alertJobDetailLogin'));
      onNavigate('login');
      return;
    }
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    if (!isLoggedIn) {
      alert(t('employment.alertPostLogin'));
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
    if (!window.confirm(t('employment.confirmDelete'))) return;
    const { error } = await supabase.from('jobs').delete().eq('id', job.id);
    if (error) { alert(t('employment.alertDeleteError', { message: error.message })); return; }
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
      alert(t('employment.alertOutsourceCloseBlocked'));
      return;
    }
    if (next && !window.confirm(t('employment.confirmClose'))) return;
    // 마감 시 closed_at 기록(1개월 자동삭제 기준) / 재오픈 시 해제, 외주는 계약자도 해제
    const patch = next
      ? { closed: true, closed_at: new Date().toISOString() }
      : { closed: false, closed_at: null, ...(job.board_type === '외주 프로젝트' ? { contractor_id: null } : {}) };
    const { error } = await supabase.from('jobs').update(patch).eq('id', job.id);
    if (error) { alert(t('employment.alertStatusError', { message: error.message })); return; }
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
            <span className="emp-fee-badge">{t('employment.feeBadge')}</span>
            <h3>{t('employment.feeHeadline')}</h3>
          </div>
          <p dangerouslySetInnerHTML={{ __html: t('employment.feeBody') }} />
        </div>
      </div>
      <div className="employment-header">
        <div className="employment-tabs">
          {TABS.map((tabName) => (
            <button
              key={tabName}
              className={`tab-button ${view === 'list' && tab === tabName ? 'active' : ''}`}
              onClick={() => { setTab(tabName); setView('list'); }}
            >
              {tabName === '전체' ? t('employment.tabAll') : tabName}
            </button>
          ))}
          {isLoggedIn && (
            <button className={`tab-button ${view === 'manage' ? 'active' : ''}`} onClick={() => setView('manage')}>
              {t('employment.myJobs', { count: myCount })}
            </button>
          )}
          <button className="new-topic-button" onClick={handleNew}>{t('employment.newJob')}</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder={t('employment.searchPlaceholder')}
            className="search-input"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenSearch && onOpenSearch('job', kw); }}
          />
          <button className="search-button" aria-label={t('employment.searchAria')} onClick={() => onOpenSearch && onOpenSearch('job', kw)}>
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </div>

      <div className="employment-main-content">
        <div className="job-listings">
          {loading ? (
            <p className="community-msg">{t('employment.loading')}</p>
          ) : list.length === 0 ? (
            <p className="community-msg">
              {view === 'manage' ? t('employment.emptyManage') : t('employment.emptyList')}
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
            <h3>{t('employment.recentJobs')}</h3>
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
              {jobs.length === 0 && <p className="community-msg" style={{ padding: '1rem 0' }}>{t('employment.noJobs')}</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EmploymentPage;
