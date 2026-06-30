import React from 'react';
import '../App.css'; // 공통 스타일
import './AuthPage.css'; // 인증 페이지 스타일
import OAuthButtons from './OAuthButtons';
import { useI18n } from '../i18n/I18nProvider';

function LoginPage({ onTogglePage }) {
  const { t } = useI18n();
  return (
    <div className="auth-form-container">
      <h2>{t('authPage.loginTitle')}</h2>
      <p className="auth-stage-desc">{t('authPage.loginDesc')}</p>
      <OAuthButtons verb={t('authPage.loginVerb')} />
      <p>
        {t('authPage.noAccount')}{' '}
        <button type="button" onClick={onTogglePage} className="toggle-button">
          {t('authPage.goSignup')}
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
