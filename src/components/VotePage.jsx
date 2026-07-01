import React, { useState, useEffect, useCallback } from 'react';
import './VotePage.css';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import { sanitize, isEmptyHtml } from '../lib/html';
import { useI18n } from '../i18n/I18nProvider';

// key/color 는 로직 식별자 — label 은 렌더 시 t() 로 해석한다.
const CHOICES = [
  { key: 'for', labelKey: 'vote.choiceFor', color: '#4ade80' },
  { key: 'against', labelKey: 'vote.choiceAgainst', color: '#fca5a5' },
  { key: 'abstain', labelKey: 'vote.choiceAbstain', color: '#94a3b8' },
];

function fmtRemaining(ms, t) {
  if (ms <= 0) return t('vote.remainingEnded');
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d > 0 ? t('vote.remainingDays', { d }) : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function Countdown({ deadline }) {
  const { t } = useI18n();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);
  const remaining = new Date(deadline).getTime() - now;
  return <span className={`vote-timer ${remaining <= 0 ? 'ended' : ''}`}>⏳ {fmtRemaining(remaining, t)}</span>;
}

function Infographic({ tally }) {
  const { t } = useI18n();
  const total = tally?.total_votes || 0;
  const eligible = tally?.eligible || 0;
  const turnout = eligible > 0 ? Math.round((total / eligible) * 100) : 0;
  const counts = { for: tally?.for_count || 0, against: tally?.against_count || 0, abstain: tally?.abstain_count || 0 };
  return (
    <div className="vote-info">
      <div className="turnout-row">
        <span className="turnout-label">{t('vote.turnout')}</span>
        <div className="turnout-bar"><div className="turnout-fill" style={{ width: `${turnout}%` }} /></div>
        <span className="turnout-num">{turnout}% <em>({total}/{eligible})</em></span>
      </div>
      <div className="choice-bars">
        {CHOICES.map((c) => {
          const n = counts[c.key];
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          return (
            <div className="choice-bar-row" key={c.key}>
              <span className="choice-name" style={{ color: c.color }}>{t(c.labelKey)}</span>
              <div className="choice-bar"><div className="choice-fill" style={{ width: `${pct}%`, background: c.color }} /></div>
              <span className="choice-num">{t('vote.voteCountPct', { n, pct })}</span>
            </div>
          );
        })}
      </div>
      <p className="vote-anon-note">{t('vote.anonNote')}</p>
    </div>
  );
}

// ISO → datetime-local input 값(로컬 시간, "YYYY-MM-DDTHH:mm")
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function VotePage({ user, profile, isMember, isSuperAdmin, isLoggedIn, onNavigate, onOpenTopic }) {
  const { t } = useI18n();
  const [votes, setVotes] = useState([]);
  const [tallies, setTallies] = useState({});
  const [myBallots, setMyBallots] = useState({});
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', deadline: '' });
  const [editingId, setEditingId] = useState(null); // 수정 중인 의제 id(수퍼관리자)
  const [submitting, setSubmitting] = useState(false);
  const [castingId, setCastingId] = useState(null);

  const canVote = !!profile?.is_member; // 실제 투표는 정회원 컬럼 기준

  const load = useCallback(async () => {
    setLoading(true);
    const { data: vs } = await supabase.from('votes').select('*').order('deadline', { ascending: false });
    const list = vs || [];
    // 마감됐지만 미게시 → 결과 공지 자동 등록 (idempotent)
    const toPublish = list.filter((v) => new Date(v.deadline).getTime() <= Date.now() && !v.published);
    if (toPublish.length) {
      await Promise.all(toPublish.map((v) => supabase.rpc('publish_vote_result', { p_vote_id: v.id })));
      const { data: vs2 } = await supabase.from('votes').select('*').order('deadline', { ascending: false });
      list.splice(0, list.length, ...(vs2 || []));
    }
    setVotes(list);
    // 집계 + 내 투표
    const tallyEntries = await Promise.all(list.map(async (v) => {
      const { data } = await supabase.rpc('vote_tally', { p_vote_id: v.id });
      return [v.id, Array.isArray(data) ? data[0] : data];
    }));
    setTallies(Object.fromEntries(tallyEntries));
    const { data: mine } = await supabase.from('vote_ballots').select('vote_id, choice');
    setMyBallots(Object.fromEntries((mine || []).map((b) => [b.vote_id, b.choice])));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCompose = () => {
    setComposing((c) => {
      const next = !c;
      if (next) { setEditingId(null); setForm({ title: '', content: '', deadline: '' }); }
      return next;
    });
  };

  const startEdit = (v) => {
    setEditingId(v.id);
    setForm({ title: v.title || '', content: v.content || '', deadline: toLocalInput(v.deadline) });
    setComposing(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setComposing(false);
    setEditingId(null);
    setForm({ title: '', content: '', deadline: '' });
  };

  const submitVote = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || isEmptyHtml(form.content) || !form.deadline || submitting) return;
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      content: form.content,
      deadline: new Date(form.deadline).toISOString(),
    };
    let error, newVote;
    if (editingId) {
      ({ error } = await supabase.from('votes').update(payload).eq('id', editingId));
    } else {
      const res = await supabase.from('votes').insert({ ...payload, created_by: user.id }).select().single();
      error = res.error; newVote = res.data;
    }
    if (!editingId && !error && newVote) {
      // 전 정회원에게 안내 이메일(미배포/도메인 미검증 시 graceful) — 인앱 알림은 DB 트리거가 발송
      try { await supabase.functions.invoke('vote-email', { body: { vote_id: newVote.id } }); } catch { /* noop */ }
    }
    setSubmitting(false);
    if (error) { alert(editingId ? t('vote.updateError', { message: error.message }) : t('vote.createError', { message: error.message })); return; }
    cancelEdit();
    load();
  };

  const cast = async (voteId, choice) => {
    if (castingId) return;
    setCastingId(voteId);
    const { error } = await supabase.from('vote_ballots').insert({ vote_id: voteId, voter_id: user.id, choice });
    setCastingId(null);
    if (error) { alert(t('vote.voteError', { message: error.message })); return; }
    load();
  };

  const ongoing = votes.filter((v) => new Date(v.deadline).getTime() > Date.now());
  const ended = votes.filter((v) => new Date(v.deadline).getTime() <= Date.now());

  const renderVote = (v, isEnded) => {
    const tally = tallies[v.id];
    const myChoice = myBallots[v.id];
    return (
      <div className={`vote-card ${isEnded ? 'ended' : ''}`} key={v.id}>
        <div className="vote-card-head">
          <h3 className="vote-card-title">{v.title}</h3>
          {isEnded ? (
            <span className="vote-status closed">{t('vote.closed')}{v.published ? t('vote.closedPublished') : ''}</span>
          ) : (
            <Countdown deadline={v.deadline} />
          )}
          {isSuperAdmin && (
            <button type="button" className="vote-edit-btn" onClick={() => startEdit(v)} title={t('vote.editAgendaTip')}>{t('vote.editAgenda')}</button>
          )}
        </div>
        {v.content && <div className="vote-content" dangerouslySetInnerHTML={{ __html: sanitize(v.content) }} />}

        <Infographic tally={tally} />

        {!isEnded && (
          <div className="vote-actions">
            {myChoice ? (
              <p className="vote-voted">{t('vote.voteCompleted')}<strong>{(() => { const c = CHOICES.find((c) => c.key === myChoice); return c ? t(c.labelKey) : ''; })()}</strong></p>
            ) : canVote ? (
              <div className="vote-buttons">
                {CHOICES.map((c) => (
                  <button key={c.key} className="vote-btn" style={{ borderColor: c.color, color: c.color }}
                    disabled={castingId === v.id} onClick={() => cast(v.id, c.key)}>
                    {t(c.labelKey)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="vote-voted">{t('vote.memberOnlyVote')}</p>
            )}
          </div>
        )}
        {isEnded && v.published && onOpenTopic && (
          <button className="vote-result-link" onClick={() => onOpenTopic(v.result_topic_id)} disabled={!v.result_topic_id}>
            {t('vote.viewResultInNotice')}
          </button>
        )}
      </div>
    );
  };

  if (!isMember) {
    // 비로그인 사용자(예: 이메일 투표 링크로 접속) → 로그인 유도
    if (!isLoggedIn) {
      return (
        <div className="vote-page content-area-container">
          <h1 className="vote-page-title">{t('vote.pageTitle')}</h1>
          <p className="vote-empty">투표는 정회원 로그인 후 이용할 수 있습니다.</p>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="nt-btn primary" onClick={() => onNavigate && onNavigate('login')}>로그인</button>
          </div>
        </div>
      );
    }
    return (
      <div className="vote-page content-area-container">
        <h1 className="vote-page-title">{t('vote.pageTitle')}</h1>
        <p className="vote-empty">{t('vote.memberOnlyView')}</p>
      </div>
    );
  }

  return (
    <div className="vote-page content-area-container">
      <div className="vote-page-header">
        <h1 className="vote-page-title">{t('vote.membersVote')}</h1>
        {isSuperAdmin && (
          <button className="nt-btn primary" onClick={openCompose}>
            {composing && !editingId ? t('vote.close') : t('vote.createAgenda')}
          </button>
        )}
      </div>

      {composing && isSuperAdmin && (
        <form className="vote-form" onSubmit={submitVote}>
          <h2 className="vote-section-title">{editingId ? t('vote.editAgendaTitle') : t('vote.newAgenda')}</h2>
          <div className="vf-field">
            <label>{t('vote.fieldTitle')}</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={t('vote.titlePlaceholder')} />
          </div>
          <div className="vf-field">
            <label>{t('vote.fieldContent')}</label>
            <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} placeholder={t('vote.contentPlaceholder')} />
          </div>
          <div className="vf-field">
            <label>{t('vote.fieldDeadline')}</label>
            <input type="datetime-local" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          </div>
          {editingId && <p className="vote-edit-note">{t('vote.editWarning')}</p>}
          <div className="vf-actions">
            <button type="button" className="nt-btn ghost" onClick={cancelEdit} disabled={submitting}>{t('vote.cancel')}</button>
            <button type="submit" className="nt-btn primary"
              disabled={submitting || !form.title.trim() || isEmptyHtml(form.content) || !form.deadline}>
              {submitting ? (editingId ? t('vote.editing') : t('vote.submitting')) : (editingId ? t('vote.saveEditAgenda') : t('vote.submitAgenda'))}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="vote-empty">{t('vote.loading')}</p>
      ) : (
        <>
          <section className="vote-section">
            <h2 className="vote-section-title">{t('vote.ongoingVotes', { n: ongoing.length })}</h2>
            {ongoing.length === 0 ? <p className="vote-empty">{t('vote.noOngoing')}</p> : ongoing.map((v) => renderVote(v, false))}
          </section>
          <section className="vote-section">
            <h2 className="vote-section-title">{t('vote.pastResults', { n: ended.length })}</h2>
            {ended.length === 0 ? <p className="vote-empty">{t('vote.noEnded')}</p> : ended.map((v) => renderVote(v, true))}
          </section>
        </>
      )}
    </div>
  );
}

export default VotePage;
