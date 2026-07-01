import React from 'react';
import { useI18n } from '../i18n/I18nProvider';
// import logo from '../assets/logo.png'; // 로고 이미지 임포트 (더 이상 사용하지 않으므로 주석 처리 또는 삭제)

function Footer({ onNavigate }) {
  const { t } = useI18n();
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* <img src={logo} alt="AIDEV Logo" className="footer-logo" /> 로고 삭제 */}
        <div className="footer-info">
          <p><strong>{t('footer.orgName')}</strong></p>
          <p>{t('footer.address')}</p>
          <p>{t('footer.email')}</p>
        </div>
        <nav className="footer-links">
          <button type="button" onClick={() => onNavigate && onNavigate('privacy')}>{t('footer.privacy')}</button>
          <span className="footer-sep" aria-hidden="true">·</span>
          <button type="button" onClick={() => onNavigate && onNavigate('terms')}>{t('footer.terms')}</button>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;