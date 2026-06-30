import React, { useState, useEffect, useCallback } from 'react';
import './TopicDetailPage.css';
import '../App.css';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import { sanitize, isEmptyHtml } from '../lib/html';
import { startConversation } from '../lib/inbox';
import ShareButton from './ShareButton';
import avatarPlaceholder from '../assets/profile-placeholder.png';
import { useI18n } from '../i18n/I18nProvider';

function formatDateTime(iso, t) {
  if (!iso) return '';
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h < 12 ? t('community.am') : t('community.pm');
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return t('community.dateTime', {
    y: d.getFullYear(),
    mo: d.getMonth() + 1,
    d: d.getDate(),
    ampm,
    h: h12,
    min: String(d.getMinutes()).padStart(2, '0'),
  });
}

function TopicDetailPage({ topicId, onBackToListings, isLoggedIn, isAdmin, user, profile, onNavigate, onOpenConversation, onProfileChanged, onViewProfile }) {
  const { t } = useI18n();
  // 작성자 이름 → 프로필 페이지 링크 (onViewProfile 제공 시)
  const Author = ({ id, name, className }) => (
    onViewProfile && id
      ? <button type="button" className={`${className} author-link`} onClick={() => onViewProfile(id, { name })}>{name}</button>
      : <span className={className}>{name}</span>
  );
  const messageAuthor = async (authorId) => {
    try {
      const cid = await startConversation(authorId);
      onOpenConversation && onOpenConversation(cid);
    } catch (e) {
      alert(t('community.alertMessageStartError', { msg: e.message }));
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

  const authorName = profile?.name || user?.email?.split('@')[0] || t('community.defaultAuthor');

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
    if (error) { alert(t('community.alertCommentCreateError', { msg: error.message })); return; }
    setCommentDrafts((d) => ({ ...d, [postId]: '' }));
    onProfileChanged?.(); // 적립된 0.1 coin 반영
    fetchAll();
  };

  const deleteComment = async (id) => {
    if (!window.confirm(t('community.confirmDeleteComment'))) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) { alert(t('community.alertDeleteError', { msg: error.message })); return; }
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // 게시글 삭제: 첫 게시글이면 주제 전체(답글·게시글 포함) 삭제, 그 외엔 해당 게시글만
  const deletePost = async (post, isFirst) => {
    const msg = isFirst
      ? t('community.confirmDeleteTopic')
      : t('community.confirmDeletePost');
    if (!window.confirm(msg)) return;
    if (isFirst) {
      const postIds = posts.map((p) => p.id);
      if (postIds.length) await supabase.from('comments').delete().in('post_id', postIds);
      await supabase.from('posts').delete().eq('topic_id', topicId);
      const { error } = await supabase.from('topics').delete().eq('id', topicId);
      if (error) { alert(t('community.alertDeleteError', { msg: error.message })); return; }
      onBackToListings();
    } else {
      await supabase.from('comments').delete().eq('post_id', post.id);
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) { alert(t('community.alertDeleteError', { msg: error.message })); return; }
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
      alert(t('community.alertReplyCreateError', { msg: error.message }));
      return;
    }
    setReply('');
    fetchAll();
  };

  if (loading) {
    return (
      <div className="topic-detail-page-container content-area-container">
        <p className="community-msg">{t('community.loading')}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="topic-detail-page-container content-area-container">
        <p>{t('community.notFound')}</p>
        <button className="back-button" onClick={onBackToListings}>{t('community.backToListings')}</button>
      </div>
    );
  }

  const voices = new Set(posts.map((p) => p.author_id)).size;
  const lastPost = posts[posts.length - 1];

  return (
    <div className="topic-detail-page-container content-area-container">
      <div className="topic-detail-main-content">
        <nav className="topic-breadcrumbs">
          <span className="crumb-link" onClick={onBackToListings}>{t('community.breadcrumbCommunity')}</span>
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
              {t('community.tagsLabel')}
              {topic.tags.map((tag, i) => <span key={i} className="topic-tag">{tag}</span>)}
            </div>
          )}
          <p className="topic-stats">
            {t('community.statsLine', {
              posts: posts.length,
              voices,
              when: lastPost ? formatDateTime(lastPost.created_at, t) : t('community.statsNone'),
              by: lastPost?.author_name || topic.author_name,
            })}
          </p>
        </div>

        <div className="topic-posts">
          {posts.map((post, idx) => (
            <div key={post.id} className="post-card">
              <div className="post-author-info">
                <img src={avatarPlaceholder} alt={t('community.avatarAlt', { name: post.author_name })} className="author-avatar" />
                <Author id={post.author_id} name={post.author_name} className="author-name" />
                <p className="author-role">{idx === 0 ? t('community.roleAuthor') : t('community.roleParticipant')}</p>
                {isLoggedIn && post.author_id !== user?.id && (
                  <button className="dm-button" onClick={() => messageAuthor(post.author_id)}>{t('community.dmButton')}</button>
                )}
              </div>
              <div className="post-content-area">
                <div className="post-header">
                  <span className="post-date">{formatDateTime(post.created_at, t)}</span>
                  <span className="post-number">#{idx + 1}</span>
                  {(isAdmin || post.author_id === user?.id) && (
                    <button className="post-delete" onClick={() => deletePost(post, idx === 0)}>
                      {idx === 0 ? t('community.deleteTopic') : t('community.deletePost')}
                    </button>
                  )}
                </div>
                <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />

                {/* 답글 */}
                <div className="comment-section">
                  {comments.filter((c) => c.post_id === post.id).map((c) => (
                    <div className="comment-item" key={c.id}>
                      <div className="comment-body">
                        <Author id={c.author_id} name={c.author_name} className="comment-author" />
                        <span className="comment-date">{formatDateTime(c.created_at, t)}</span>
                        <p className="comment-text">{c.content}</p>
                      </div>
                      {(isAdmin || c.author_id === user?.id) && (
                        <button className="comment-delete" onClick={() => deleteComment(c.id)} aria-label={t('community.commentDeleteAria')}>✕</button>
                      )}
                    </div>
                  ))}

                  {isLoggedIn && (
                    <div className="comment-form">
                      <input
                        type="text"
                        className="comment-input"
                        placeholder={t('community.commentPlaceholder')}
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) => setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addComment(post.id); } }}
                      />
                      <button
                        className="comment-submit"
                        disabled={commentBusy || !(commentDrafts[post.id] || '').trim()}
                        onClick={() => addComment(post.id)}
                      >
                        {t('community.commentSubmit')}
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
            <h3>{t('community.replyTitle')}</h3>
            <RichTextEditor value={reply} onChange={setReply} placeholder={t('community.replyPlaceholder')} />
            <div className="reply-actions">
              <button type="button" className="nt-btn ghost" onClick={onBackToListings}>{t('community.backToList')}</button>
              <button type="submit" className="nt-btn primary" disabled={submitting || isEmptyHtml(reply)}>
                {submitting ? t('community.submitting') : t('community.submitReply')}
              </button>
            </div>
          </form>
        ) : (
          <div className="login-to-reply-section">
            <p className="login-message">{t('community.loginToReply')}</p>
            <button className="nt-btn primary" onClick={() => onNavigate('login')}>{t('community.login')}</button>
          </div>
        )}
      </div>

      <aside className="community-sidebar">
        <div className="recent-topics-section">
          <h3>{t('community.recentTopics')}</h3>
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
