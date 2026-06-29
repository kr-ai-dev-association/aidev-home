import React, { useState, useEffect, useCallback, useRef } from 'react';
import './InboxPage.css';
import { supabase } from '../lib/supabase';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  return `${Math.floor(diff / 2592000)}개월 전`;
}

function InboxPage({ user, initialConversationId, onUnreadChange, onOpenTopic }) {
  const myId = user?.id;
  const [tab, setTab] = useState(initialConversationId ? 'messages' : 'notifications');
  const [notifs, setNotifs] = useState([]);
  const [convs, setConvs] = useState([]);
  const [activeConv, setActiveConv] = useState(null); // conversation object
  const [thread, setThread] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef(null);

  // 목록 로드
  const loadLists = useCallback(async () => {
    const [{ data: n }, { data: cv }] = await Promise.all([
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('conversations').select('*').order('last_message_at', { ascending: false, nullsFirst: false }),
    ]);
    setNotifs(n || []);
    setConvs(cv || []);
    return cv || [];
  }, []);

  // 대화 스레드 로드 + 읽음 처리
  const openConversation = useCallback(async (conv) => {
    setActiveConv(conv);
    setTab('messages');
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });
    setThread(data || []);
    // 상대가 보낸 안 읽은 메시지 읽음 처리
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conv.id)
      .is('read_at', null)
      .neq('sender_id', myId);
    onUnreadChange && onUnreadChange();
  }, [myId, onUnreadChange]);

  useEffect(() => {
    loadLists().then((cv) => {
      if (initialConversationId) {
        const c = cv.find((x) => x.id === initialConversationId);
        if (c) openConversation(c);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const otherName = (c) => (c.user_a === myId ? c.user_b_name : c.user_a_name) || '사용자';

  const markNotifRead = async (n) => {
    if (!n.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', n.id);
      setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      onUnreadChange && onUnreadChange();
    }
    if ((n.type === 'comment' || n.type === 'notice') && n.data?.topic_id && onOpenTopic) {
      onOpenTopic(n.data.topic_id);
    }
  };

  const markAllNotifsRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    setNotifs((prev) => prev.map((x) => ({ ...x, read: true })));
    onUnreadChange && onUnreadChange();
  };

  const deleteNotif = async (n) => {
    if (!window.confirm('이 알림을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('notifications').delete().eq('id', n.id);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setNotifs((prev) => prev.filter((x) => x.id !== n.id));
    onUnreadChange && onUnreadChange();
  };

  const deleteAllNotifs = async () => {
    if (notifs.length === 0) return;
    if (!window.confirm('모든 알림을 삭제하시겠습니까?')) return;
    // RLS로 본인 알림만 삭제되도록 user_id 기준으로 일괄 삭제 (목록 50건 제한과 무관)
    const { error } = await supabase.from('notifications').delete().eq('user_id', myId);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setNotifs([]);
    onUnreadChange && onUnreadChange();
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || sending || !activeConv) return;
    setSending(true);
    const myDisplay = (activeConv.user_a === myId ? activeConv.user_a_name : activeConv.user_b_name) || '나';
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: activeConv.id, sender_id: myId, sender_name: myDisplay, content: text })
      .select()
      .single();
    setSending(false);
    if (error) { alert(`전송 오류: ${error.message}`); return; }
    setThread((t) => [...t, data]);
    setDraft('');
    loadLists();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('메시지를 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setThread((t) => t.filter((m) => m.id !== id));
    loadLists();
    onUnreadChange && onUnreadChange();
  };

  const deleteConversation = async () => {
    if (!activeConv) return;
    if (!window.confirm('이 대화를 삭제하시겠습니까? 주고받은 메시지가 모두 삭제됩니다.')) return;
    const { error } = await supabase.from('conversations').delete().eq('id', activeConv.id);
    if (error) { alert(`삭제 오류: ${error.message}`); return; }
    setActiveConv(null);
    setThread([]);
    loadLists();
    onUnreadChange && onUnreadChange();
  };

  return (
    <div className="inbox-page content-area-container">
      <h1 className="inbox-title">메시지함</h1>
      <div className="inbox-tabs">
        <button className={`inbox-tab ${tab === 'notifications' ? 'active' : ''}`} onClick={() => { setTab('notifications'); setActiveConv(null); }}>
          알림{notifs.some((n) => !n.read) ? ` (${notifs.filter((n) => !n.read).length})` : ''}
        </button>
        <button className={`inbox-tab ${tab === 'messages' ? 'active' : ''}`} onClick={() => { setTab('messages'); }}>
          메시지
        </button>
      </div>

      {/* 알림 탭 */}
      {tab === 'notifications' && (
        <div className="inbox-panel">
          {notifs.length > 0 && (
            <div className="inbox-actions">
              {notifs.some((n) => !n.read) && (
                <button className="inbox-mark-all" onClick={markAllNotifsRead}>모두 읽음</button>
              )}
              <button className="inbox-mark-all inbox-delete-all" onClick={deleteAllNotifs}>모두 삭제</button>
            </div>
          )}
          {notifs.length === 0 ? (
            <p className="inbox-empty">알림이 없습니다.</p>
          ) : (
            <ul className="notif-list">
              {notifs.map((n) => (
                <li key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => markNotifRead(n)}>
                  <span className="notif-dot" />
                  <div className="notif-body">
                    <p className="notif-text"><strong>{n.actor_name}</strong>님 · {n.body}</p>
                    <span className="notif-time">{timeAgo(n.created_at)}</span>
                  </div>
                  <button
                    className="notif-delete"
                    onClick={(e) => { e.stopPropagation(); deleteNotif(n); }}
                    aria-label="알림 삭제"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 메시지 탭 */}
      {tab === 'messages' && (
        <div className="inbox-messages">
          <div className="conv-list">
            {convs.length === 0 ? (
              <p className="inbox-empty">대화가 없습니다.<br />게시글·공고 상세에서 작성자에게 메시지를 보낼 수 있습니다.</p>
            ) : (
              convs.map((c) => (
                <div
                  key={c.id}
                  className={`conv-item ${activeConv?.id === c.id ? 'active' : ''}`}
                  onClick={() => openConversation(c)}
                >
                  <div className="conv-avatar">{otherName(c).charAt(0)}</div>
                  <div className="conv-meta">
                    <p className="conv-name">{otherName(c)}</p>
                    <p className="conv-last">{c.last_message_text || '대화를 시작하세요'}</p>
                  </div>
                  <span className="conv-time">{timeAgo(c.last_message_at)}</span>
                </div>
              ))
            )}
          </div>

          <div className="conv-thread">
            {!activeConv ? (
              <p className="inbox-empty thread-empty">대화를 선택하세요.</p>
            ) : (
              <>
                <div className="thread-header">
                  <span>{otherName(activeConv)}</span>
                  <button className="thread-delete" onClick={deleteConversation}>대화 삭제</button>
                </div>
                <div className="thread-messages">
                  {thread.map((m) => (
                    <div key={m.id} className={`bubble-row ${m.sender_id === myId ? 'mine' : 'theirs'}`}>
                      {m.sender_id === myId && (
                        <button className="msg-delete" onClick={() => deleteMessage(m.id)} aria-label="메시지 삭제">✕</button>
                      )}
                      <div className="bubble">
                        <p>{m.content}</p>
                        <span className="bubble-time">{timeAgo(m.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={threadEndRef} />
                </div>
                <div className="thread-input">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                    placeholder="메시지를 입력하세요..."
                  />
                  <button onClick={send} disabled={sending || !draft.trim()}>전송</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InboxPage;
