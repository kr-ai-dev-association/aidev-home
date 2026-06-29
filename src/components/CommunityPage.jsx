import React, { useState, useEffect, useCallback } from 'react';
import './CommunityPage.css';
import '../App.css';
import { supabase } from '../lib/supabase';
import TopicDetailPage from './TopicDetailPage';
import RichTextEditor from './RichTextEditor';
import { isEmptyHtml } from '../lib/html';

const CATEGORIES = ['일반 토론', '바이브코딩', 'AI/LLM', '취업·커리어', '질문/답변'];
const ADMIN_CATEGORY = '공지사항';

// 상대 시간 표시
function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
  return `${Math.floor(diff / 31536000)}년 전`;
}

function CommunityPage({ isLoggedIn, isAdmin, onNavigate, user, profile, initialTopicId, onTopicConsumed, onOpenConversation, onOpenSearch, onProfileChanged }) {
  // 관리자는 '공지사항' 카테고리 추가 노출
  const categoryOptions = isAdmin ? [ADMIN_CATEGORY, ...CATEGORIES] : CATEGORIES;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({ title: '', category: CATEGORIES[0], tags: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  // 봇 검증: 산술 캡차 + 허니팟 + 최소 작성시간 (서버 10분 간격제한과 2중 방어)
  const [honeypot, setHoneypot] = useState('');
  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  const [captchaAns, setCaptchaAns] = useState('');
  const [openedAt, setOpenedAt] = useState(0);
  const newCaptcha = () => setCaptcha({ a: 1 + Math.floor(Math.random() * 9), b: 1 + Math.floor(Math.random() * 9) });
  const captchaOk = parseInt(captchaAns, 10) === captcha.a + captcha.b;

  const authorName = profile?.name || user?.email?.split('@')[0] || '익명';

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('topics')
      .select('*, posts(count)')
      .order('last_activity_at', { ascending: false });
    if (!error) setTopics(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // 알림 등에서 특정 주제로 바로 진입
  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
      onTopicConsumed && onTopicConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopicId]);

  // 공유용 URL 동기화(상세 진입/이탈 시 주소 반영)
  useEffect(() => {
    const path = selectedTopicId ? `/community/topic/${selectedTopicId}` : '/community';
    if (window.location.pathname !== path) window.history.replaceState(null, '', path);
  }, [selectedTopicId]);

  const handleTopicClick = (topicId) => {
    if (!isLoggedIn) {
      alert('로그인해야 토픽 상세 정보를 볼 수 있습니다.');
      onNavigate('login');
      return;
    }
    setSelectedTopicId(topicId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewTopicClick = () => {
    if (!isLoggedIn) {
      alert('로그인해야 새 주제를 작성할 수 있습니다.');
      onNavigate('login');
      return;
    }
    newCaptcha();
    setCaptchaAns('');
    setHoneypot('');
    setOpenedAt(Date.now());
    setComposing(true);
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || isEmptyHtml(form.content) || submitting) return;
    // 봇 검증 (사람 여부 확인)
    if (honeypot) { alert('비정상적인 요청으로 작성이 차단되었습니다.'); return; } // 허니팟: 사람은 비워둠
    if (Date.now() - openedAt < 3000) { alert('너무 빠르게 제출되었습니다. 잠시 후 다시 시도해주세요.'); return; }
    if (!captchaOk) { alert('자동입력 방지 답이 올바르지 않습니다.'); newCaptcha(); setCaptchaAns(''); return; }
    setSubmitting(true);
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    // 1) 주제 생성
    const { data: topic, error: tErr } = await supabase
      .from('topics')
      .insert({
        title: form.title.trim(),
        category: form.category,
        tags,
        author_id: user.id,
        author_name: authorName,
        last_activity_by: authorName,
      })
      .select()
      .single();
    if (tErr) {
      setSubmitting(false);
      alert(`주제 생성 오류: ${tErr.message}`);
      return;
    }
    // 2) 첫 게시글(본문) 생성
    const { error: pErr } = await supabase.from('posts').insert({
      topic_id: topic.id,
      author_id: user.id,
      author_name: authorName,
      content: form.content.trim(),
    });
    setSubmitting(false);
    if (pErr) {
      alert(`게시글 생성 오류: ${pErr.message}`);
      return;
    }
    setComposing(false);
    setForm({ title: '', category: CATEGORIES[0], tags: '', content: '' });
    onProfileChanged?.(); // 적립된 coin 반영
    setSelectedTopicId(topic.id); // 작성한 주제로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToListings = () => {
    setSelectedTopicId(null);
    fetchTopics(); // 목록 갱신(답글 수/최근활동 반영)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedTopicId) {
    return (
      <TopicDetailPage
        topicId={selectedTopicId}
        onBackToListings={handleBackToListings}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        user={user}
        profile={profile}
        onNavigate={onNavigate}
        onOpenConversation={onOpenConversation}
        onProfileChanged={onProfileChanged}
      />
    );
  }

  const filtered = topics.filter((t) =>
    !search.trim() ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(search.toLowerCase())
  );

  // 공지사항을 항상 최상단에 고정, 그 외에는 최근활동 순 유지
  const sorted = [...filtered].sort((a, b) => {
    const an = a.category === ADMIN_CATEGORY ? 1 : 0;
    const bn = b.category === ADMIN_CATEGORY ? 1 : 0;
    if (an !== bn) return bn - an;
    return new Date(b.last_activity_at) - new Date(a.last_activity_at);
  });

  return (
    <div className="community-page-container content-area-container">
      <div className="community-header">
        <div className="community-tabs">
          <button className="tab-button active">모든 포럼</button>
          <button className="new-topic-button" onClick={handleNewTopicClick}>+ 새 주제 작성</button>
        </div>
        <div className="community-search-bar">
          <input
            type="text"
            placeholder="검색 (Enter로 통합 검색)"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenSearch && onOpenSearch('community', search); }}
          />
          <button className="search-button" aria-label="검색" onClick={() => onOpenSearch && onOpenSearch('community', search)}>
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </div>

      {/* 새 주제 작성 폼 */}
      {composing && (
        <form className="new-topic-form" onSubmit={handleCreateTopic}>
          <h3>새 주제 작성</h3>
          <div className="nt-field">
            <label>제목</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="제목을 입력하세요" />
          </div>
          <div className="nt-row">
            <div className="nt-field">
              <label>카테고리</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="nt-field">
              <label>태그 (쉼표 구분)</label>
              <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="예: 질문, LLM" />
            </div>
          </div>
          <div className="nt-field">
            <label>내용</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              placeholder="내용을 입력하세요"
            />
          </div>
          {/* 허니팟(봇 탐지용 — 화면에 보이지 않으며 사람은 비워둠) */}
          <input
            type="text" className="nt-honeypot" tabIndex={-1} autoComplete="off"
            value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden="true"
          />
          {/* 자동입력 방지(산술 캡차) */}
          <div className="nt-field nt-captcha">
            <label>자동입력 방지 — 다음 계산의 답을 입력하세요: <strong>{captcha.a} + {captcha.b} = ?</strong></label>
            <input
              type="text" inputMode="numeric" value={captchaAns}
              onChange={(e) => setCaptchaAns(e.target.value)}
              placeholder="정답 숫자"
              className={captchaAns && !captchaOk ? 'nt-captcha-bad' : ''}
            />
          </div>
          <p className="nt-coin-hint">💰 글을 작성하면 <strong>1 coin</strong>이 적립됩니다.</p>
          {!isAdmin && <p className="nt-ratelimit-hint">⏱️ 도배 방지를 위해 글은 10분에 1회 작성할 수 있습니다.</p>}
          <div className="nt-actions">
            <button type="button" className="nt-btn ghost" onClick={() => setComposing(false)} disabled={submitting}>취소</button>
            <button type="submit" className="nt-btn primary" disabled={submitting || !form.title.trim() || isEmptyHtml(form.content) || !captchaOk}>
              {submitting ? '등록 중...' : '주제 등록'}
            </button>
          </div>
        </form>
      )}

      <div className="community-main-content">
        <div className="community-topics-list">
          <div className="topic-header">
            <div className="header-item topic-col">주제</div>
            <div className="header-item posts-col">게시글</div>
            <div className="header-item last-updated-col">최근 업데이트</div>
          </div>

          {loading ? (
            <p className="community-msg">불러오는 중...</p>
          ) : filtered.length === 0 ? (
            <p className="community-msg">{search ? '검색 결과가 없습니다.' : '아직 등록된 주제가 없습니다. 첫 주제를 작성해보세요!'}</p>
          ) : (
            sorted.map((topic) => {
              const postCount = topic.posts?.[0]?.count ?? 0;
              const isNotice = topic.category === ADMIN_CATEGORY;
              return (
                <div key={topic.id} className={`topic-card${isNotice ? ' pinned' : ''}`} onClick={() => handleTopicClick(topic.id)}>
                  <div className="topic-icon-col"><span className="topic-icon">💬</span></div>
                  <div className="topic-details-col">
                    <h3 className="topic-title">
                      {topic.category === ADMIN_CATEGORY && <span className="notice-badge">📢 공지</span>}
                      {topic.title}
                    </h3>
                    {Array.isArray(topic.tags) && topic.tags.length > 0 && (
                      <div className="topic-pagination">
                        {topic.tags.map((tag) => <span key={tag} className="page-number">{tag}</span>)}
                      </div>
                    )}
                    <p className="topic-meta">
                      시작: <span className="topic-author">{topic.author_name}</span>, 카테고리:{' '}
                      <span className="topic-category">{topic.category}</span>
                    </p>
                  </div>
                  <div className="posts-col">{postCount}</div>
                  <div className="last-updated-col">
                    <p className="last-updated-time">{timeAgo(topic.last_activity_at)}</p>
                    <p className="last-updated-author">{topic.last_activity_by || topic.author_name}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
