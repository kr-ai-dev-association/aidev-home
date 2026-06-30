import React, { useEffect, useState, useCallback } from 'react';
import './MediationPage.css';
import { supabase } from '../lib/supabase';
import { startConversation } from '../lib/inbox';
import {
  MEDIATION_STATUS, MEDIATION_STAGE_ACTIONS, ASSIGNEE_ROLES, medStatus, fmtDate,
} from '../lib/mediation';
import { useI18n } from '../i18n/I18nProvider';

function MediationsAdminPage({ isAdmin, onOpenConversation, onBack }) {
  const { t } = useI18n();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [steps, setSteps] = useState({});
  const [busy, setBusy] = useState(null);
  const [draft, setDraft] = useState({}); // id -> {status,title,note,변호사,변리사,전문가}

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('mediations').select('*').order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const openDetail = async (m) => {
    if (openId === m.id) { setOpenId(null); return; }
    setOpenId(m.id);
    if (!steps[m.id]) {
      const { data } = await supabase.from('mediation_steps').select('*').eq('mediation_id', m.id).order('step_no', { ascending: true });
      setSteps((prev) => ({ ...prev, [m.id]: data || [] }));
    }
    const cur = (m.assignees || []).reduce((acc, a) => ({ ...acc, [a.role]: a.name }), {});
    setDraft((d) => ({ ...d, [m.id]: { status: '', title: '', note: '', ...cur } }));
  };

  const setD = (id, k, v) => setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), [k]: v } }));

  const advance = async (m) => {
    const dr = draft[m.id] || {};
    if (!dr.status || !dr.title.trim()) { alert(t('mediation.advanceValidation')); return; }
    const assignees = ASSIGNEE_ROLES.map((r) => (dr[r] && dr[r].trim() ? { role: r, name: dr[r].trim() } : null)).filter(Boolean);
    setBusy(m.id);
    const { error } = await supabase.rpc('advance_mediation', {
      p_id: m.id, p_status: dr.status, p_step_title: dr.title.trim(),
      p_note: dr.note.trim() || null, p_assignees: assignees.length ? assignees : null,
    });
    // 단계별 이메일(미배포/도메인 미검증 시 graceful)
    try { await supabase.functions.invoke('mediation-email', { body: { mediation_id: m.id } }); } catch { /* noop */ }
    setBusy(null);
    if (error) { alert(t('mediation.advanceErr', { msg: error.message })); return; }
    // 새로고침
    setSteps((prev) => ({ ...prev, [m.id]: undefined }));
    const { data: sd } = await supabase.from('mediation_steps').select('*').eq('mediation_id', m.id).order('step_no', { ascending: true });
    setSteps((prev) => ({ ...prev, [m.id]: sd || [] }));
    setRows((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: dr.status, assignees: assignees.length ? assignees : x.assignees } : x)));
    setDraft((d) => ({ ...d, [m.id]: { ...(d[m.id] || {}), status: '', title: '', note: '' } }));
    alert(t('mediation.advanceSuccess'));
  };

  const dm = async (uid) => {
    if (!uid) return;
    try { const cid = await startConversation(uid); onOpenConversation && onOpenConversation(cid); } catch (e) { alert(e.message); }
  };

  if (!isAdmin) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>{t('mediation.noPermissionTitle')}</h3>
            <p className="section-lead">{t('mediation.noPermissionLead')}</p></section>
        </div>
      </div>
    );
  }

  const counts = {
    open: rows.filter((r) => ['submitted', 'reviewing', 'assigned', 'in_progress'].includes(r.status)).length,
    done: rows.filter((r) => ['resolved', 'closed'].includes(r.status)).length,
  };

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          {onBack && <button type="button" className="admin-back-btn" onClick={onBack}>{t('mediation.adminBack')}</button>}
          <h3>{t('mediation.adminTitle')}</h3>
          <p className="section-lead">{t('mediation.adminLead', { open: counts.open, done: counts.done })}</p>

          {loading ? <p className="admin-msg">{t('mediation.loading')}</p>
          : rows.length === 0 ? <p className="admin-msg">{t('mediation.adminNoRequests')}</p>
          : (
            <div className="myjobs-list">
              {rows.map((m) => {
                const st = medStatus(m.status);
                const open = openId === m.id;
                const sl = steps[m.id] || [];
                const dr = draft[m.id] || {};
                return (
                  <div className="myjob-card" key={m.id}>
                    <div className="myjob-head" onClick={() => openDetail(m)} style={{ cursor: 'pointer' }}>
                      <div>
                        <span className="b2b-status" style={{ color: st.color, borderColor: st.color }}>{st.label}</span>
                        <span className="med-cat-pill">{m.category}</span>
                        <span className="med-type-pill">{m.requester_type}</span>
                        <h4>{m.title}</h4>
                        <span className="myjob-deadline">{m.requester_name} {m.counterparty ? t('mediation.counterpartySuffix', { name: m.counterparty }) : ''} · {fmtDate(m.created_at)}</span>
                      </div>
                      <div className="myjob-count"><span className="myjob-caret">{open ? '▴' : '▾'}</span></div>
                    </div>

                    {open && (
                      <div className="myjob-apps">
                        <div className="dispute-detail-block"><h5>{t('mediation.blockContent')}</h5><p className="apply-msg" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p></div>
                        {m.desired && <div className="dispute-detail-block"><h5>{t('mediation.blockDesired')}</h5><p className="apply-msg" style={{ whiteSpace: 'pre-wrap' }}>{m.desired}</p></div>}
                        {Array.isArray(m.attachments) && m.attachments.length > 0 && (
                          <div className="dispute-detail-block"><h5>{t('mediation.blockEvidence')}</h5>
                            <ul className="detail-attach-list">{m.attachments.map((a, i) => (
                              <li className="detail-attach-item" key={i}><span className="jf-attach-kind">🔗 LINK</span><a href={a.url} target="_blank" rel="noreferrer">{a.name}</a></li>
                            ))}</ul>
                          </div>
                        )}
                        {Array.isArray(m.assignees) && m.assignees.length > 0 && (
                          <div className="dispute-detail-block"><h5>{t('mediation.blockCurrentAssignment')}</h5>
                            <div className="med-assignees">{m.assignees.map((a, i) => <span className="med-assignee" key={i}>{a.role} {a.name}</span>)}</div>
                          </div>
                        )}
                        <div className="dispute-detail-block"><h5>{t('mediation.blockHistory')}</h5>
                          {sl.length === 0 ? <p className="med-hint">{t('mediation.noHistory')}</p>
                          : <ol className="med-timeline">{sl.map((s) => (<li key={s.id}><strong>{s.title}</strong>{s.note && <p>{s.note}</p>}<span className="med-time">{fmtDate(s.created_at)} · {medStatus(s.status).label}</span></li>))}</ol>}
                        </div>

                        {/* 단계 진행 입력 */}
                        <div className="med-admin-form">
                          <h5>{t('mediation.adminFormTitle')}</h5>
                          <div className="med-admin-grid">
                            <select value={dr.status || ''} onChange={(e) => {
                              const v = e.target.value;
                              const preset = MEDIATION_STAGE_ACTIONS.find((a) => a.status === v);
                              setDraft((d) => ({ ...d, [m.id]: { ...(d[m.id] || {}), status: v, title: (d[m.id]?.title) || (preset?.title || '') } }));
                            }}>
                              <option value="">{t('mediation.selectStagePlaceholder')}</option>
                              {MEDIATION_STAGE_ACTIONS.map((a) => <option key={a.status} value={a.status}>{MEDIATION_STATUS[a.status].label} — {a.title}</option>)}
                            </select>
                            <input type="text" placeholder={t('mediation.stageTitlePlaceholder')} value={dr.title || ''} onChange={(e) => setD(m.id, 'title', e.target.value)} />
                          </div>
                          <div className="med-admin-grid3">
                            {ASSIGNEE_ROLES.map((r) => (
                              <input key={r} type="text" placeholder={r} value={dr[r] || ''} onChange={(e) => setD(m.id, r, e.target.value)} />
                            ))}
                          </div>
                          <textarea rows={2} placeholder={t('mediation.adminNotePlaceholder')} value={dr.note || ''} onChange={(e) => setD(m.id, 'note', e.target.value)} />
                          <div className="apply-actions-row">
                            <button className="b2b-status-btn contract" disabled={busy === m.id} onClick={() => advance(m)}>{t('mediation.advanceBtn')}</button>
                            <button className="b2b-status-btn" onClick={() => dm(m.requester_id)}>{t('mediation.messageBtn')}</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MediationsAdminPage;
