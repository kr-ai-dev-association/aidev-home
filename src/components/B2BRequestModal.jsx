import React, { useState } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';
import { useI18n } from '../i18n/I18nProvider';

// 조합 B2B 의뢰(견적 문의 / 평가 신청) 입력 모달 — 로그인한 조합원이면 누구나 의뢰 가능
function B2BRequestModal({ type, user, profile, onClose }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    company: profile?.company || '',
    contact_name: profile?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.company.trim() && form.contact_name.trim() && form.email.trim() && form.message.trim();
  // type 은 DB 식별자(한국어 고정). 화면 표시만 현재 언어로 매핑.
  const typeLabel = type === '조합 B2B 평가 신청' ? t('admin.b2bTypeEval')
    : type === '조합 B2B 견적 문의' ? t('admin.b2bTypeQuote') : type;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    const { data: inserted, error } = await supabase.from('b2b_requests').insert({
      type,
      company: form.company.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
      requester_id: user.id,
      requester_name: profile?.name || user.email,
    }).select().single();
    if (!error && inserted) {
      // 조합 담당자(tonymustbegreat@gmail.com)에게 접수 알림 이메일 — 미배포 시 graceful
      try { await supabase.functions.invoke('b2b-email', { body: { b2b_request_id: inserted.id } }); } catch { /* noop */ }
    }
    setSubmitting(false);
    if (error) { alert(t('admin.submitError', { msg: error.message })); return; }
    setDone(true);
  };

  return (
    <div className="b2b-overlay" onClick={onClose}>
      <div className="b2b-modal" onClick={(e) => e.stopPropagation()}>
        <button className="b2b-close" onClick={onClose} aria-label={t('admin.closeAria')}>✕</button>
        {done ? (
          <div className="b2b-done">
            <div className="b2b-done-icon">✅</div>
            <h3>{t('admin.modalDoneTitle')}</h3>
            <p>{t('admin.modalDoneDesc')}</p>
            <button className="nt-btn primary" onClick={onClose}>{t('admin.modalConfirm')}</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="b2b-head">
              <span className="b2b-badge">{t('admin.modalBadge')}</span>
              <h3>{typeLabel}</h3>
              <p>{t('admin.modalHeadDesc')}</p>
            </div>
            <div className="b2b-field">
              <label>{t('admin.fieldCompany')} <span className="req">*</span></label>
              <input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder={t('admin.fieldCompanyPlaceholder')} />
            </div>
            <div className="b2b-row">
              <div className="b2b-field">
                <label>{t('admin.fieldContact')} <span className="req">*</span></label>
                <input value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} placeholder={t('admin.fieldContactPlaceholder')} />
              </div>
              <div className="b2b-field">
                <label>{t('admin.fieldPhone')}</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder={t('admin.fieldPhonePlaceholder')} />
              </div>
            </div>
            <div className="b2b-field">
              <label>{t('admin.fieldEmail')} <span className="req">*</span></label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder={t('admin.fieldEmailPlaceholder')} />
            </div>
            <div className="b2b-field">
              <label>{t('admin.fieldMessage')} <span className="req">*</span></label>
              <textarea rows={5} value={form.message} onChange={(e) => update('message', e.target.value)}
                placeholder={type === '조합 B2B 평가 신청'
                  ? t('admin.fieldMessagePlaceholderEval')
                  : t('admin.fieldMessagePlaceholderQuote')} />
            </div>
            <div className="b2b-actions">
              <button type="button" className="nt-btn ghost" onClick={onClose} disabled={submitting}>{t('admin.cancel')}</button>
              <button type="submit" className="nt-btn primary" disabled={!valid || submitting}>
                {submitting ? t('admin.submitting') : t('admin.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default B2BRequestModal;
