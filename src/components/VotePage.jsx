import React, { useState, useEffect, useCallback } from 'react';
import './VotePage.css';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import { sanitize, isEmptyHtml } from '../lib/html';

const CHOICES = [
  { key: 'for', label: '찬성', color: '#4ade80' },
  { key: 'against', label: '반대', color: '#fca5a5' },
  { key: 'abstain', label: '기권', color: '#94a3b8' },
];

function fmtRemaining(ms) {
  if (ms <= 0) return '마감됨';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d > 0 ? d + '일 ' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function Countdown({ deadline }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);
  const remaining = new Date(deadline).getTime() - now;
  return <span className={`vote-timer ${remaining <= 0 ? 'ended' : ''}`}>⏳ {fmtRemaining(remaining)}</span>;
}

function Infographic({ tally }) {
  const total = tally?.total_votes || 0;
  const eligible = tally?.eligible || 0;
  const turnout = eligible > 0 ? Math.round((total / eligible) * 100) : 0;
  const counts = { for: tally?.for_count || 0, against: tally?.against_count || 0, abstain: tally?.abstain_count || 0 };
  return (
    <div className="vote-info">
      <div className="turnout-row">
        <span className="turnout-label">투표율</span>
        <div className="turnout-bar"><div className="turnout-fill" style={{ width: `${turnout}%` }} /></div>
        <span className="turnout-num">{turnout}% <em>({total}/{eligible})</em></span>
      </div>
      <div className="choice-bars">
        {CHOICES.map((c) => {
          const n = counts[c.key];
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          return (
            <div className="choice-bar-row" key={c.key}>
              <span className="choice-name" style={{ color: c.color }}>{c.label}</span>
              <div className="choice-bar"><div className="choice-fill" style={{ width: `${pct}%`, background: c.color }} /></div>
              <span className="choice-num">{n}표 · {pct}%</span>
            </div>
          );
        })}
      </div>
      <p className="vote-anon-note">※ 모든 투표는 익명으로 집계됩니다.</p>
    </div>
  );
}

function VotePage({ user, profile, isMember, isSuperAdmin, onOpenTopic }) {
  const [votes, setVotes] = useState([]);
  const [tallies, setTallies] = useState({});
  const [myBallots, setMyBallots] = useState({});
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', deadline: '' });
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

  const createVote = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || isEmptyHtml(form.content) || !form.deadline || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from('votes').insert({
      title: form.title.trim(),
      content: form.content,
      deadline: new Date(form.deadline).toISOString(),
      created_by: user.id,
    });
    setSubmitting(false);
    if (error) { alert(`의제 생성 오류: ${error.message}`); return; }
    setComposing(false);
    setForm({ title: '', content: '', deadline: '' });
    load();
  };

  const cast = async (voteId, choice) => {
    if (castingId) return;
    setCastingId(voteId);
    const { error } = await supabase.from('vote_ballots').insert({ vote_id: voteId, voter_id: user.id, choice });
    setCastingId(null);
    if (error) { alert(`투표 오류: ${error.message}`); return; }
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
            <span className="vote-status closed">종료{v.published ? ' · 공지됨' : ''}</span>
          ) : (
            <Countdown deadline={v.deadline} />
          )}
        </div>
        {v.content && <div className="vote-content" dangerouslySetInnerHTML={{ __html: sanitize(v.content) }} />}

        <Infographic tally={tally} />

        {!isEnded && (
          <div className="vote-actions">
            {myChoice ? (
              <p className="vote-voted">✓ 투표 완료 — <strong>{CHOICES.find((c) => c.key === myChoice)?.label}</strong></p>
            ) : canVote ? (
              <div className="vote-buttons">
                {CHOICES.map((c) => (
                  <button key={c.key} className="vote-btn" style={{ borderColor: c.color, color: c.color }}
                    disabled={castingId === v.id} onClick={() => cast(v.id, c.key)}>
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="vote-voted">정회원만 투표할 수 있습니다.</p>
            )}
          </div>
        )}
        {isEnded && v.published && onOpenTopic && (
          <button className="vote-result-link" onClick={() => onOpenTopic(v.result_topic_id)} disabled={!v.result_topic_id}>
            공지사항에서 결과 보기
          </button>
        )}
      </div>
    );
  };

  if (!isMember) {
    return (
      <div className="vote-page content-area-container">
        <h1 className="vote-page-title">투표</h1>
        <p className="vote-empty">정회원만 열람할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="vote-page content-area-container">
      <div className="vote-page-header">
        <h1 className="vote-page-title">조합원 투표</h1>
        {isSuperAdmin && (
          <button className="nt-btn primary" onClick={() => setComposing((c) => !c)}>
            {composing ? '닫기' : '+ 의제 만들기'}
          </button>
        )}
      </div>

      {composing && isSuperAdmin && (
        <form className="vote-form" onSubmit={createVote}>
          <div className="vf-field">
            <label>제목</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="의제 제목" />
          </div>
          <div className="vf-field">
            <label>내용</label>
            <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} placeholder="의제 내용" />
          </div>
          <div className="vf-field">
            <label>마감 기한 (날짜·시간)</label>
            <input type="datetime-local" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          </div>
          <div className="vf-actions">
            <button type="button" className="nt-btn ghost" onClick={() => setComposing(false)} disabled={submitting}>취소</button>
            <button type="submit" className="nt-btn primary"
              disabled={submitting || !form.title.trim() || isEmptyHtml(form.content) || !form.deadline}>
              {submitting ? '등록 중...' : '의제 등록'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="vote-empty">불러오는 중...</p>
      ) : (
        <>
          <section className="vote-section">
            <h2 className="vote-section-title">진행 중인 투표 ({ongoing.length})</h2>
            {ongoing.length === 0 ? <p className="vote-empty">진행 중인 투표가 없습니다.</p> : ongoing.map((v) => renderVote(v, false))}
          </section>
          <section className="vote-section">
            <h2 className="vote-section-title">지난 투표 결과 ({ended.length})</h2>
            {ended.length === 0 ? <p className="vote-empty">종료된 투표가 없습니다.</p> : ended.map((v) => renderVote(v, true))}
          </section>
        </>
      )}
    </div>
  );
}

export default VotePage;
