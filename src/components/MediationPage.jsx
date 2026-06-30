import React, { useEffect, useState, useCallback } from 'react';
import './MediationPage.css';
import { supabase } from '../lib/supabase';
import {
  REQUESTER_TYPES, MEDIATION_CATEGORIES, MEDIATION_STATUS, medStatus, fmtDate,
} from '../lib/mediation';

const EMPTY = { requester_type: '노동자', category: MEDIATION_CATEGORIES[0], counterparty: '', title: '', content: '', desired: '' };

function MediationPage({ user, isLoggedIn, profile, initialTab }) {
  const [tab, setTab] = useState(initialTab === 'request' ? 'request' : 'status');
  const [form, setForm] = useState(EMPTY);
  const [links, setLinks] = useState([]); // 증빙 링크 [{name,url}]
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [steps, setSteps] = useState({}); // mediation_id -> steps[]

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase.from('mediations').select('*').eq('requester_id', user.id).order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (m) => {
    if (openId === m.id) { setOpenId(null); return; }
    setOpenId(m.id);
    if (!steps[m.id]) {
      const { data } = await supabase.from('mediation_steps').select('*').eq('mediation_id', m.id).order('step_no', { ascending: true });
      setSteps((prev) => ({ ...prev, [m.id]: data || [] }));
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addLink = () => {
    const url = window.prompt('증빙 자료 링크 (계약서·임금명세서·근로계약 등, https://...)');
    if (!url) return;
    const name = window.prompt('자료 이름 (예: 근로계약서)') || url;
    setLinks((l) => [...l, { name, url }]);
  };
  const removeLink = (i) => setLinks((l) => l.filter((_, idx) => idx !== i));

  const valid = form.title.trim() && form.content.trim() && form.category && form.requester_type;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    const payload = {
      requester_id: user.id,
      requester_name: profile?.name || user.user_metadata?.name || user.email,
      requester_type: form.requester_type,
      category: form.category,
      counterparty: form.counterparty.trim() || null,
      title: form.title.trim(),
      content: form.content.trim(),
      desired: form.desired.trim() || null,
      attachments: links,
    };
    const { data, error } = await supabase.from('mediations').insert(payload).select().single();
    if (!error) {
      // 접수 확인 이메일(미배포/도메인 미검증 시 graceful)
      try { await supabase.functions.invoke('mediation-email', { body: { mediation_id: data.id } }); } catch { /* noop */ }
    }
    setSubmitting(false);
    if (error) { alert(`의뢰 접수 오류: ${error.message}`); return; }
    setForm(EMPTY); setLinks([]);
    await load();
    setTab('status');
    alert('분쟁 조정 의뢰가 접수되었습니다. 진행 상황은 ‘나의 조정 현황’에서 확인하실 수 있습니다.');
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>로그인이 필요합니다</h3>
            <p className="section-lead">분쟁 조정 의뢰는 조합원 로그인 후 이용할 수 있습니다.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>분쟁 조정 의뢰</h3>
          <p className="section-lead">
            노동·프리랜서·자영업 현장의 임금·해고·산재·불법파견·위장도급·불공정계약·기술탈취·지식재산권 분쟁을
            조합이 <strong>변호사·변리사·전문가</strong>를 배정해 단계별로 조정합니다.
          </p>

          <div className="myapp-tabs">
            <button className={`tab-button ${tab === 'status' ? 'active' : ''}`} onClick={() => setTab('status')}>나의 조정 현황 ({rows.length})</button>
            <button className={`tab-button ${tab === 'request' ? 'active' : ''}`} onClick={() => setTab('request')}>+ 새 조정 의뢰</button>
          </div>

          {tab === 'request' ? (
            <form className="med-form" onSubmit={submit}>
              <div className="med-field">
                <label>의뢰자 구분</label>
                <div className="med-radios">
                  {REQUESTER_TYPES.map((t) => (
                    <button type="button" key={t} className={`med-chip ${form.requester_type === t ? 'on' : ''}`} onClick={() => set('requester_type', t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="med-field">
                <label>분쟁 유형</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {MEDIATION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="med-field">
                <label>상대방(기업/기관)</label>
                <input type="text" value={form.counterparty} onChange={(e) => set('counterparty', e.target.value)} placeholder="예: ○○테크 주식회사 (선택)" />
              </div>
              <div className="med-field">
                <label>제목 <span className="req">*</span></label>
                <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="분쟁을 한 줄로 요약" maxLength={120} />
              </div>
              <div className="med-field">
                <label>분쟁 상세 내용 <span className="req">*</span></label>
                <textarea rows={8} value={form.content} onChange={(e) => set('content', e.target.value)}
                  placeholder="발생 경위, 기간, 계약 형태(정규직/계약직/프리랜서/도급), 실제 근무 형태(출퇴근·업무지시 여부), 피해 내용 등을 구체적으로 작성해 주세요." />
              </div>
              <div className="med-field">
                <label>희망 해결 방안</label>
                <textarea rows={3} value={form.desired} onChange={(e) => set('desired', e.target.value)} placeholder="예: 체불 임금 정산, 부당해고 철회, 정규직 전환, 손해배상 등 (선택)" />
              </div>
              <div className="med-field">
                <label>증빙 자료 링크</label>
                <ul className="med-links">
                  {links.map((l, i) => (
                    <li key={i}><a href={l.url} target="_blank" rel="noreferrer">🔗 {l.name}</a>
                      <button type="button" onClick={() => removeLink(i)}>✕</button></li>
                  ))}
                </ul>
                <button type="button" className="nt-btn ghost small" onClick={addLink}>+ 자료 링크 추가</button>
                <p className="med-hint">계약서·임금명세서·업무지시 기록·메신저 캡처 링크 등을 첨부하면 조정이 빨라집니다.</p>
              </div>
              <div className="med-cost-notice">⚠️ 분쟁 조정 의뢰 시 <strong>1,000 coin</strong>이 차감됩니다. (조정단 운영·전문가 배정 비용)</div>
              <div className="med-actions">
                <button type="submit" className="nt-btn primary" disabled={!valid || submitting}>{submitting ? '접수 중…' : '분쟁 조정 의뢰하기 (1,000 coin)'}</button>
              </div>
              <p className="med-privacy">제출된 내용은 조합 분쟁조정위원회와 배정된 변호사·변리사·전문가만 열람합니다.</p>
            </form>
          ) : (
            loading ? <p className="admin-msg">불러오는 중...</p>
            : rows.length === 0 ? <p className="admin-msg">의뢰한 분쟁 조정이 없습니다. ‘+ 새 조정 의뢰’에서 신청해보세요.</p>
            : (
              <div className="myjobs-list">
                {rows.map((m) => {
                  const st = medStatus(m.status);
                  const open = openId === m.id;
                  const sl = steps[m.id] || [];
                  return (
                    <div className="myjob-card" key={m.id}>
                      <div className="myjob-head" onClick={() => openDetail(m)} style={{ cursor: 'pointer' }}>
                        <div>
                          <span className="b2b-status" style={{ color: st.color, borderColor: st.color }}>{st.label}</span>
                          <span className="med-cat-pill">{m.category}</span>
                          <h4>{m.title}</h4>
                          <span className="myjob-deadline">{m.counterparty ? `상대: ${m.counterparty} · ` : ''}의뢰 {fmtDate(m.created_at)}</span>
                        </div>
                        <div className="myjob-count"><span className="myjob-caret">{open ? '▴' : '▾'}</span></div>
                      </div>
                      {open && (
                        <div className="myjob-apps">
                          <MedProgress status={m.status} />
                          <div className="dispute-detail-block"><h5>의뢰 내용</h5><p className="apply-msg" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p></div>
                          {m.desired && <div className="dispute-detail-block"><h5>희망 해결 방안</h5><p className="apply-msg" style={{ whiteSpace: 'pre-wrap' }}>{m.desired}</p></div>}
                          {Array.isArray(m.assignees) && m.assignees.length > 0 && (
                            <div className="dispute-detail-block"><h5>배정 전문가</h5>
                              <div className="med-assignees">{m.assignees.map((a, i) => <span className="med-assignee" key={i}>{a.role} {a.name}</span>)}</div>
                            </div>
                          )}
                          <div className="dispute-detail-block"><h5>진행 단계</h5>
                            {sl.length === 0 ? <p className="med-hint">아직 등록된 진행 단계가 없습니다. 접수 검토 중입니다.</p>
                            : <ol className="med-timeline">{sl.map((s) => (
                                <li key={s.id}><strong>{s.title}</strong>{s.note && <p>{s.note}</p>}<span className="med-time">{fmtDate(s.created_at)}</span></li>
                              ))}</ol>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}

// 상태 진행 바
function MedProgress({ status }) {
  const order = ['submitted', 'reviewing', 'assigned', 'in_progress', 'resolved'];
  const curKey = status === 'closed' ? 'resolved' : status;
  const cur = order.indexOf(curKey);
  const labels = { submitted: '접수', reviewing: '검토', assigned: '배정', in_progress: '조정', resolved: '해결' };
  return (
    <div className="med-progress">
      {order.map((k, i) => (
        <React.Fragment key={k}>
          <div className={`med-step ${i <= cur ? 'done' : ''}`}>
            <span className="med-dot">{i < cur ? '✓' : i + 1}</span>
            <span className="med-step-label">{labels[k]}</span>
          </div>
          {i < order.length - 1 && <div className={`med-bar ${i < cur ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default MediationPage;
