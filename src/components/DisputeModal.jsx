import React, { useState } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';
import { useI18n } from '../i18n/I18nProvider';

// 분쟁 내용 작성 — 공고+기능요구사항이 자동 링크되어 관리자에게 전달
function DisputeModal({ job, user, profile, role, onClose }) {
  const { t } = useI18n();
  const roleLabel = role === '의뢰자' ? t('disputeModal.roleClient') : role === '수행자' ? t('disputeModal.rolePerformer') : role;
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const features = Array.isArray(job.details?.features) ? job.details.features : [];

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const snapshot = {
      title: job.title,
      board_type: job.board_type,
      description: job.description,
      details: job.details || {},
    };
    const { error } = await supabase.from('disputes').insert({
      job_id: job.id,
      job_title: job.title,
      job_snapshot: snapshot,
      reporter_id: user.id,
      reporter_name: profile?.name || user?.email,
      reporter_role: role,
      client_id: job.author_id,
      contractor_id: job.contractor_id,
      content: content.trim(),
    });
    setSubmitting(false);
    if (error) { alert(t('disputeModal.errorAlert', { msg: error.message })); return; }
    setDone(true);
  };

  return (
    <div className="b2b-overlay" onClick={onClose}>
      <div className="b2b-modal" onClick={(e) => e.stopPropagation()}>
        <button className="b2b-close" onClick={onClose} aria-label={t('disputeModal.close')}>✕</button>
        {done ? (
          <div className="b2b-done">
            <div className="b2b-done-icon">📨</div>
            <h3>{t('disputeModal.doneTitle')}</h3>
            <p>{t('disputeModal.doneDesc')}</p>
            <button className="nt-btn primary" onClick={onClose}>{t('disputeModal.confirm')}</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="b2b-head">
              <span className="b2b-badge">{t('disputeModal.badge')}</span>
              <h3>{job.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: t('disputeModal.introHtml', { role: roleLabel }) }} />
            </div>
            <div className="dispute-linked" dangerouslySetInnerHTML={{ __html: t('disputeModal.linkedHtml', { title: job.title, count: features.length }) }} />
            <div className="b2b-field">
              <label>{t('disputeModal.contentLabel')} <span className="req">*</span></label>
              <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={t('disputeModal.contentPlaceholder')} />
            </div>
            <p className="apply-profile-note">
              {t('disputeModal.note')}
            </p>
            <div className="b2b-actions">
              <button type="button" className="nt-btn ghost" onClick={onClose} disabled={submitting}>{t('disputeModal.cancel')}</button>
              <button type="submit" className="nt-btn primary" disabled={!content.trim() || submitting}>
                {submitting ? t('disputeModal.submitting') : t('disputeModal.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DisputeModal;
