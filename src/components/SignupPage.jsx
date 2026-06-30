import React, { useState } from 'react';
import '../App.css'; // 공통 스타일
import './AuthPage.css'; // 인증 페이지 스타일
import OAuthButtons from './OAuthButtons';
import { supabase } from '../lib/supabase';
import { useI18n } from '../i18n/I18nProvider';

const INDIVIDUAL_CATEGORIES = ['학생', '취업준비생', '프리랜서', '직장인', '자영업'];

// detailsMode: 소셜 인증을 마친 신규 회원의 추가 정보 입력 단계 (App이 제어)
function SignupPage({ onTogglePage, detailsMode = false, user = null, onProfileSaved }) {
  const { t } = useI18n();
  const CATEGORY_LABELS = {
    '학생': t('authPage.catStudent'),
    '취업준비생': t('authPage.catJobSeeker'),
    '프리랜서': t('authPage.catFreelancer'),
    '직장인': t('authPage.catEmployee'),
    '자영업': t('authPage.catSelfEmployed'),
  };
  const [form, setForm] = useState({
    accountType: 'individual',
    name: '',
    company: '',
    position: '',
    category: '',
    email: user?.email || '',
    phone: '',
    agreed: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.agreed &&
    (form.accountType === 'corporate'
      ? form.company.trim() && form.position.trim()
      : form.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    const { data, error } = await supabase.from('profiles').insert({
      id: user.id,
      account_type: form.accountType,
      name: form.name.trim(),
      company: form.accountType === 'corporate' ? form.company.trim() : null,
      position: form.accountType === 'corporate' ? form.position.trim() : null,
      category: form.accountType === 'individual' ? form.category : null,
      email: form.email.trim(),
      phone: form.phone.trim(),
      privacy_agreed: form.agreed,
    }).select().single();
    setSubmitting(false);
    if (error) {
      alert(t('authPage.saveError', { msg: error.message }));
      return;
    }
    onProfileSaved?.(data);
  };

  // 1단계: 소셜 인증 (App에서 detailsMode가 아닐 때)
  if (!detailsMode) {
    return (
      <div className="auth-form-container">
        <h2>{t('authPage.signupTitle')}</h2>
        <p className="auth-stage-desc">{t('authPage.signupAuthDesc')}</p>
        <OAuthButtons verb={t('authPage.signupVerb')} />
        <p>
          {t('authPage.haveAccount')}{' '}
          <button type="button" onClick={onTogglePage} className="toggle-button">{t('authPage.goLogin')}</button>
        </p>
      </div>
    );
  }

  // 2단계: 추가 정보 입력 (인증 완료 후)
  return (
    <div className="auth-form-container signup-details">
      <h2>{t('authPage.detailsTitle')}</h2>
      <p className="auth-stage-desc">{t('authPage.detailsDesc')}</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        {/* 구분 */}
        <div className="form-field">
          <label>{t('authPage.fieldType')}</label>
          <div className="type-toggle">
            <button
              type="button"
              className={form.accountType === 'individual' ? 'active' : ''}
              onClick={() => update('accountType', 'individual')}
            >
              {t('authPage.typeIndividual')}
            </button>
            <button
              type="button"
              className={form.accountType === 'corporate' ? 'active' : ''}
              onClick={() => update('accountType', 'corporate')}
            >
              {t('authPage.typeCorporate')}
            </button>
          </div>
        </div>

        {/* 이름 (공통) */}
        <div className="form-field">
          <label htmlFor="su-name">{t('authPage.fieldName')}</label>
          <input
            id="su-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={t('authPage.namePlaceholder')}
          />
        </div>

        {/* 개인: 세부 카테고리 */}
        {form.accountType === 'individual' && (
          <div className="form-field">
            <label htmlFor="su-category">{t('authPage.fieldCategory')}</label>
            <select
              id="su-category"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              <option value="">{t('authPage.categorySelect')}</option>
              {INDIVIDUAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
              ))}
            </select>
          </div>
        )}

        {/* 법인: 회사명 + 직책 */}
        {form.accountType === 'corporate' && (
          <>
            <div className="form-field">
              <label htmlFor="su-company">{t('authPage.fieldCompany')}</label>
              <input
                id="su-company"
                type="text"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder={t('authPage.companyPlaceholder')}
              />
            </div>
            <div className="form-field">
              <label htmlFor="su-position">{t('authPage.fieldPosition')}</label>
              <input
                id="su-position"
                type="text"
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
                placeholder={t('authPage.positionPlaceholder')}
              />
            </div>
          </>
        )}

        {/* 이메일 */}
        <div className="form-field">
          <label htmlFor="su-email">{t('authPage.fieldEmail')}</label>
          <input
            id="su-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder={t('authPage.emailPlaceholder')}
          />
        </div>

        {/* 전화번호 */}
        <div className="form-field">
          <label htmlFor="su-phone">{t('authPage.fieldPhone')}</label>
          <input
            id="su-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder={t('authPage.phonePlaceholder')}
          />
        </div>

        {/* 개인정보 보호 안내 */}
        <div className="form-field">
          <label htmlFor="su-privacy">{t('authPage.fieldPrivacy')}</label>
          <textarea id="su-privacy" className="privacy-textarea" value={t('authPage.privacyText')} readOnly rows={12} />
        </div>

        {/* 동의 체크박스 */}
        <label className="consent-row">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => update('agreed', e.target.checked)}
          />
          <span>{t('authPage.consent')}</span>
        </label>

        <button type="submit" className="auth-submit-button" disabled={!isValid || submitting}>
          {submitting ? t('authPage.submitting') : t('authPage.submit')}
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
