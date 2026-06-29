import React, { useState, useEffect, useCallback } from 'react';
import './TopicDetailPage.css';
import '../App.css';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import { sanitize, isEmptyHtml } from '../lib/html';
import { startConversation } from '../lib/inbox';
import ShareButton from './ShareButton';
import avatarPlaceholder from '../assets/profile-placeholder.png';

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${h12}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function TopicDetailPage({ topicId, onBackToListings, isLoggedIn, isAdmin, user, profile, onNavigate, onOpenConversation, onProfileChanged }) {
  const messageAuthor = async (authorId) => {
    try {
      const cid = await startConversation(authorId);
      onOpenConversation && onOpenConversation(cid);
    } catch (e) {
      alert(`메시지 시작 오류: ${e.message}`);
    }
  };
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentBusy, setCommentBusy] = useState(false);

  const authorName = profile?.name || user?.email?.split('@')[0] || '익명';

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: t }, { data: p }, { data: r }] = await Promise.all([
      supabase.from('topics').select('*').eq('id', topicId).maybeSingle(),
      supabase.from('posts').select('*').eq('topic_id', topicId).order('created_at', { ascending: true }),
      supabase.from('topics').select('id, title').order('last_activity_at', { ascending: false }).limit(5),
    ]);
    setTopic(t || null);
    setPosts(p || []);
    setRecent(r || []);
    // 게시글들의 답글 일괄 조회
    const postIds = (p || []).map((x) => x.id);
    if (postIds.length) {
      const { data: c } = await supabase
        .from('comments')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });
      setComments(c || []);
    } else {
      setComments([]);
    }
    setLoading(false);
  }, [topicId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addComment = async (postId) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text || commentBusy) return;
    setCommentBusy(true);
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      author_name: authorName,
      content: text,
    });
    setCommentBusy(false);
    if (error) { alert(`답글 등록 오류: ${error.message}`); return; }
    setCommentDrafts((d) => ({ ...d, [postId]: '' }));
    onProfileChanged?.(); // 적립된 0.1 coin 반영
    fetchAll();
  };

  const deleteComment = async (id) => {
    if (!window.confirm('답글을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // 게시글 삭제: 첫 게시글이면 주제 전체(답글·게시글 포함) 삭제, 그 외엔 해당 게시글만
  const deletePost = async (post, isFirst) => {
    const msg = isFirst
      ? '이 주제를 삭제하시겠습니까? 모든 게시글과 답글이 함께 삭제됩니다.'
      : '이 게시글을 삭제하시겠습니까? 달린 답글도 함께 삭제됩니다.';
    if (!window.confirm(msg)) return;
    if (isFirst) {
      const postIds = posts.map((p) => p.id);
      if (postIds.length) await supabase.from('comments').delete().in('post_id', postIds);
      await supabase.from('posts').delete().eq('topic_id', topicId);
      const { error } = await supabase.from('topics').delete().eq('id', topicId);
      if (error) { alert(`삭제 오류: ${error.message}`); return; }
      onBackToListings();
    } else {
      await supabase.from('comments').delete().eq('post_id', post.id);
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) { alert(`삭제 오류: ${error.message}`); return; }
      fetchAll();
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (isEmptyHtml(reply) || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from('posts').insert({
      topic_id: topicId,
      author_id: user.id,
      author_name: authorName,
      content: reply.trim(),
    });
    setSubmitting(false);
    if (error) {
      alert(`답변 등록 오류: ${error.message}`);
      return;
    }
    setReply('');
    fetchAll();
  };

  if (loading) {
    return (
      <div className="topic-detail-page-container content-area-container">
        <p className="community-msg">불러오는 중...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="topic-detail-page-container content-area-container">
        <p>토픽을 찾을 수 없습니다.</p>
        <button className="back-button" onClick={onBackToListings}>목록으로 돌아가기</button>
      </div>
    );
  }

  const voices = new Set(posts.map((p) => p.author_id)).size;
  const lastPost = posts[posts.length - 1];

  return (
    <div className="topic-detail-page-container content-area-container">
      <div className="topic-detail-main-content">
        <nav className="topic-breadcrumbs">
          <span className="crumb-link" onClick={onBackToListings}>커뮤니티</span>
          <span>›</span>
          <span className="current-category">{topic.category}</span>
          <span>›</span>
          <span className="current-topic">{topic.title}</span>
        </nav>

        <div className="topic-detail-actions">
          <ShareButton
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}/community/topic/${topicId}`}
            title={topic.title}
            text={`[${topic.category}] ${topic.title}`}
          />
        </div>

        <div className="topic-summary-card">
          {Array.isArray(topic.tags) && topic.tags.length > 0 && (
            <div className="topic-tags">
              태그:
              {topic.tags.map((tag, i) => <span key={i} className="topic-tag">{tag}</span>)}
            </div>
          )}
          <p className="topic-stats">
            이 주제는 <strong>{posts.length}</strong>개의 게시글, <strong>{voices}</strong>명의 참여자가 있으며, 마지막 업데이트는{' '}
            <strong>{lastPost ? formatDateTime(lastPost.created_at) : '-'}</strong>에{' '}
            <span className="last-updated-author">{lastPost?.author_name || topic.author_name}</span>에 의해 이루어졌습니다.
          </p>
        </div>

        <div className="topic-posts">
          {posts.map((post, idx) => (
            <div key={post.id} className="post-card">
              <div className="post-author-info">
                <img src={avatarPlaceholder} alt={`${post.author_name} 아바타`} className="author-avatar" />
                <p className="author-name">{post.author_name}</p>
                <p className="author-role">{idx === 0 ? '작성자' : '참여자'}</p>
                {isLoggedIn && post.author_id !== user?.id && (
                  <button className="dm-button" onClick={() => messageAuthor(post.author_id)}>✉️ 메시지</button>
                )}
              </div>
              <div className="post-content-area">
                <div className="post-header">
                  <span className="post-date">{formatDateTime(post.created_at)}</span>
                  <span className="post-number">#{idx + 1}</span>
                  {(isAdmin || post.author_id === user?.id) && (
                    <button className="post-delete" onClick={() => deletePost(post, idx === 0)}>
                      🗑 {idx === 0 ? '주제 삭제' : '게시글 삭제'}
                    </button>
                  )}
                </div>
                <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />

                {/* 답글 */}
                <div className="comment-section">
                  {comments.filter((c) => c.post_id === post.id).map((c) => (
                    <div className="comment-item" key={c.id}>
                      <div className="comment-body">
                        <span className="comment-author">{c.author_name}</span>
                        <span className="comment-date">{formatDateTime(c.created_at)}</span>
                        <p className="comment-text">{c.content}</p>
                      </div>
                      {(isAdmin || c.author_id === user?.id) && (
                        <button className="comment-delete" onClick={() => deleteComment(c.id)} aria-label="답글 삭제">✕</button>
                      )}
                    </div>
                  ))}

                  {isLoggedIn && (
                    <div className="comment-form">
                      <input
                        type="text"
                        className="comment-input"
                        placeholder="답글 달기... (작성 시 0.1 coin 적립)"
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) => setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addComment(post.id); } }}
                      />
                      <button
                        className="comment-submit"
                        disabled={commentBusy || !(commentDrafts[post.id] || '').trim()}
                        onClick={() => addComment(post.id)}
                      >
                        등록
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 답변 작성 */}
        {isLoggedIn ? (
          <form className="reply-section" onSubmit={handleReply}>
            <h3>답변 작성</h3>
            <RichTextEditor value={reply} onChange={setReply} placeholder="답변을 입력하세요..." />
            <div className="reply-actions">
              <button type="button" className="nt-btn ghost" onClick={onBackToListings}>목록으로</button>
              <button type="submit" className="nt-btn primary" disabled={submitting || isEmptyHtml(reply)}>
                {submitting ? '등록 중...' : '답변 등록'}
              </button>
            </div>
          </form>
        ) : (
          <div className="login-to-reply-section">
            <p className="login-message">이 주제에 답변하려면 로그인해야 합니다.</p>
            <button className="nt-btn primary" onClick={() => onNavigate('login')}>로그인</button>
          </div>
        )}
      </div>

      <aside className="community-sidebar">
        <div className="recent-topics-section">
          <h3>최근 주제</h3>
          <ul className="recent-topics-list">
            {recent.map((item) => (
              <li key={item.id}><span className="topic-bullet">💬</span> {item.title}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default TopicDetailPage;
