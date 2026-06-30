import React, { useEffect, useState, useCallback } from 'react';
import './MediationPage.css';
import { supabase } from '../lib/supabase';
import {
  REQUESTER_TYPES, MEDIATION_CATEGORIES, MEDIATION_STATUS, medStatus, fmtDate,
} from '../lib/mediation';
import { useI18n } from '../i18n/I18nProvider';

const EMPTY = { requester_type: '노동자', category: MEDIATION_CATEGORIES[0], counterparty: '', title: '', content: '', desired: '' };

function MediationPage({ user, isLoggedIn, profile, initialTab }) {
  const { t } = useI18n();
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
    const url = window.prompt(t('mediation.promptLinkUrl'));
    if (!url) return;
    const name = window.prompt(t('mediation.promptLinkName')) || url;
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
    if (error) { alert(t('mediation.submitErr', { msg: error.message })); return; }
    setForm(EMPTY); setLinks([]);
    await load();
    setTab('status');
    alert(t('mediation.submitSuccess'));
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>{t('mediation.loginRequiredTitle')}</h3>
            <p className="section-lead">{t('mediation.loginRequiredLead')}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>{t('mediation.title')}</h3>
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('mediation.lead') }} />

          <div className="myapp-tabs">
            <button className={`tab-button ${tab === 'status' ? 'active' : ''}`} onClick={() => setTab('status')}>{t('mediation.tabStatus', { count: rows.length })}</button>
            <button className={`tab-button ${tab === 'request' ? 'active' : ''}`} onClick={() => setTab('request')}>{t('mediation.tabRequest')}</button>
          </div>

          {tab === 'request' ? (
            <form className="med-form" onSubmit={submit}>
              <div className="med-field">
                <label>{t('mediation.fieldRequesterType')}</label>
                <div className="med-radios">
                  {REQUESTER_TYPES.map((rt) => (
                    <button type="button" key={rt} className={`med-chip ${form.requester_type === rt ? 'on' : ''}`} onClick={() => set('requester_type', rt)}>{rt}</button>
                  ))}
                </div>
              </div>
              <div className="med-field">
                <label>{t('mediation.fieldCategory')}</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {MEDIATION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="med-field">
                <label>{t('mediation.fieldCounterparty')}</label>
                <input type="text" value={form.counterparty} onChange={(e) => set('counterparty', e.target.value)} placeholder={t('mediation.counterpartyPlaceholder')} />
              </div>
              <div className="med-field">
                <label>{t('mediation.fieldTitle')} <span className="req">{t('mediation.requiredMark')}</span></label>
                <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder={t('mediation.titlePlaceholder')} maxLength={120} />
              </div>
              <div className="med-field">
                <label>{t('mediation.fieldContent')} <span className="req">{t('mediation.requiredMark')}</span></label>
                <textarea rows={8} value={form.content} onChange={(e) => set('content', e.target.value)}
                  placeholder={t('mediation.contentPlaceholder')} />
              </div>
              <div className="med-field">
                <label>{t('mediation.fieldDesired')}</label>
                <textarea rows={3} value={form.desired} onChange={(e) => set('desired', e.target.value)} placeholder={t('mediation.desiredPlaceholder')} />
              </div>
              <div className="med-field">
                <label>{t('mediation.fieldEvidence')}</label>
                <ul className="med-links">
                  {links.map((l, i) => (
                    <li key={i}><a href={l.url} target="_blank" rel="noreferrer">🔗 {l.name}</a>
                      <button type="button" onClick={() => removeLink(i)}>✕</button></li>
                  ))}
                </ul>
                <button type="button" className="nt-btn ghost small" onClick={addLink}>{t('mediation.addLink')}</button>
                <p className="med-hint">{t('mediation.evidenceHint')}</p>
              </div>
              <div className="med-cost-notice" dangerouslySetInnerHTML={{ __html: t('mediation.costNotice') }} />
              <div className="med-actions">
                <button type="submit" className="nt-btn primary" disabled={!valid || submitting}>{submitting ? t('mediation.submitting') : t('mediation.submit')}</button>
              </div>
              <p className="med-privacy">{t('mediation.privacy')}</p>
            </form>
          ) : (
            loading ? <p className="admin-msg">{t('mediation.loading')}</p>
            : rows.length === 0 ? <p className="admin-msg">{t('mediation.noRequests')}</p>
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
                          <span className="myjob-deadline">{m.counterparty ? t('mediation.counterpartyPrefix', { name: m.counterparty }) : ''}{t('mediation.requestedAt', { date: fmtDate(m.created_at) })}</span>
                        </div>
                        <div className="myjob-count"><span className="myjob-caret">{open ? '▴' : '▾'}</span></div>
                      </div>
                      {open && (
                        <div className="myjob-apps">
                          <MedProgress status={m.status} />
                          <div className="dispute-detail-block"><h5>{t('mediation.blockContent')}</h5><p className="apply-msg" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p></div>
                          {m.desired && <div className="dispute-detail-block"><h5>{t('mediation.blockDesired')}</h5><p className="apply-msg" style={{ whiteSpace: 'pre-wrap' }}>{m.desired}</p></div>}
                          {Array.isArray(m.assignees) && m.assignees.length > 0 && (
                            <div className="dispute-detail-block"><h5>{t('mediation.blockAssignees')}</h5>
                              <div className="med-assignees">{m.assignees.map((a, i) => <span className="med-assignee" key={i}>{a.role} {a.name}</span>)}</div>
                            </div>
                          )}
                          <div className="dispute-detail-block"><h5>{t('mediation.blockSteps')}</h5>
                            {sl.length === 0 ? <p className="med-hint">{t('mediation.noSteps')}</p>
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
  const { t } = useI18n();
  const order = ['submitted', 'reviewing', 'assigned', 'in_progress', 'resolved'];
  const curKey = status === 'closed' ? 'resolved' : status;
  const cur = order.indexOf(curKey);
  const labels = { submitted: t('mediation.stepSubmitted'), reviewing: t('mediation.stepReviewing'), assigned: t('mediation.stepAssigned'), in_progress: t('mediation.stepInProgress'), resolved: t('mediation.stepResolved') };
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
