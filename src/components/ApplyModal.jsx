import React, { useState } from 'react';
import './B2BRequestModal.css';
import { useI18n } from '../i18n/I18nProvider';
import { supabase } from '../lib/supabase';

// 조합 플랫폼 지원 모달 — 지원 내용 + 프로필 스냅샷을 공고 작성자에게 전달
function ApplyModal({ job, user, profile, onClose }) {
  const { t } = useI18n();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    const snapshot = {
      name: profile?.name || null,
      main_title: profile?.main_title || null,
      about: profile?.about || null,
      skills: Array.isArray(profile?.skills) ? profile.skills : [],
      location: profile?.location || null,
      rate: profile?.rate || null,
      linkedin_url: profile?.linkedin_url || null,
      email: user?.email || null,
      phone: profile?.phone || null,
    };
    const { error } = await supabase.from('job_applications').insert({
      job_id: job.id,
      applicant_id: user.id,
      applicant_name: profile?.name || user?.email,
      message: message.trim(),
      profile: snapshot,
    });
    setSubmitting(false);
    if (error) {
      alert(/duplicate|unique/i.test(error.message) ? t('employment.alertAlreadyApplied') : t('employment.alertApplyError', { message: error.message }));
      return;
    }
    setDone(true);
  };

  return (
    <div className="b2b-overlay" onClick={onClose}>
      <div className="b2b-modal" onClick={(e) => e.stopPropagation()}>
        <button className="b2b-close" onClick={onClose} aria-label={t('employment.modalClose')}>✕</button>
        {done ? (
          <div className="b2b-done">
            <div className="b2b-done-icon">✅</div>
            <h3>{t('employment.applyDoneTitle')}</h3>
            <p>{t('employment.applyDoneDesc')}</p>
            <button className="nt-btn primary" onClick={onClose}>{t('employment.confirm')}</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="b2b-head">
              <span className="b2b-badge">{t('employment.applyBadge')}</span>
              <h3>{job.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: t('employment.applyIntro') }} />
            </div>
            <div className="b2b-field">
              <label>{t('employment.applyMessageLabel')}<span className="req">*</span></label>
              <textarea rows={7} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder={t('employment.applyMessagePlaceholder')} />
            </div>
            <p className="apply-profile-note">
              {t('employment.applyProfileNote')}<strong>{profile?.name || user?.email}</strong>
              {profile?.main_title ? ` · ${profile.main_title}` : ''}
              {Array.isArray(profile?.skills) && profile.skills.length ? ` · ${profile.skills.slice(0, 4).join(', ')}` : ''}
            </p>
            <div className="b2b-actions">
              <button type="button" className="nt-btn ghost" onClick={onClose} disabled={submitting}>{t('employment.cancel')}</button>
              <button type="submit" className="nt-btn primary" disabled={!message.trim() || submitting}>
                {submitting ? t('employment.submitting') : t('employment.submitApplication')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyModal;
