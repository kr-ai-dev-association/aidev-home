import React, { useEffect } from 'react'; // useEffect 임포트
import socialAiTop from '../assets/social ai top.png'; // 히어로 배경 이미지
import ServiceIcon from './ServiceIcon'; // 통일 라인 아이콘
import { useI18n } from '../i18n/I18nProvider';
import '../App.css'; // 공통 스타일을 위해 App.css 임포트

function AboutPage({ scrollToSectionId, onScrollComplete }) { // scrollToSectionId, onScrollComplete prop 추가
  const { t } = useI18n();
  // scrollToSectionId prop이 변경될 때 해당 섹션으로 스크롤하는 useEffect
  useEffect(() => {
    if (scrollToSectionId) {
      const element = document.getElementById(scrollToSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (onScrollComplete) {
          onScrollComplete();
        }
      }
    }
  }, [scrollToSectionId, onScrollComplete]);

  return (
    <div className="home-landing about-landing">
      {/* 히어로 */}
      <section className="hero-banner" id="about-intro-section" style={{ backgroundImage: `url(${socialAiTop})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">{t('about.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.heroTitle') }} />
          <p>{t('about.heroDesc')}</p>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 설립 개요 */}
        <section className="section-services" id="about-overview-section">
          <h3>{t('about.overviewTitle')}</h3>
          <div className="about-mission">
            <p dangerouslySetInnerHTML={{ __html: t('about.overviewMission') }} />
          </div>
          <h4 className="about-subhead">{t('about.membershipSubhead')}</h4>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="b2c" />
              <span className="track-badge">{t('about.memberIndivBadge')}</span>
              <h4>{t('about.memberIndivTitle')}</h4>
              <p>{t('about.memberIndivDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <span className="track-badge">{t('about.memberCorpBadge')}</span>
              <h4>{t('about.memberCorpTitle')}</h4>
              <p>{t('about.memberCorpDesc')}</p>
            </div>
          </div>
        </section>

        {/* 지배구조 */}
        <section className="section-services" id="about-governance-section">
          <h3>{t('about.governanceTitle')}</h3>
          <p className="section-lead">{t('about.governanceLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>{t('about.govVoteTitle')}</h4>
              <p>{t('about.govVoteDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>{t('about.govConflictTitle')}</h4>
              <p>{t('about.govConflictDesc')}</p>
            </div>
          </div>
        </section>

        {/* 전략적 파트너십 */}
        <section className="section-services" id="about-partnership-section">
          <h3>{t('about.partnershipTitle')}</h3>
          <p className="section-lead">{t('about.partnershipLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <h4>{t('about.partCashTitle')}</h4>
              <p>{t('about.partCashDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>{t('about.partMouTitle')}</h4>
              <p>{t('about.partMouDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>{t('about.partDividendTitle')}</h4>
              <p>{t('about.partDividendDesc')}</p>
            </div>
          </div>
        </section>

        {/* 수익화 및 배당 원칙 */}
        <section className="section-services" id="about-monetization-section">
          <h3>{t('about.monetizationTitle')}</h3>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>{t('about.moneySaasTitle')}</h4>
              <p>{t('about.moneySaasDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>{t('about.moneyB2bTitle')}</h4>
              <p>{t('about.moneyB2bDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="academia" />
              <h4>{t('about.moneyAcaTitle')}</h4>
              <p>{t('about.moneyAcaDesc')}</p>
            </div>
          </div>
          <div className="about-dividend">
            <h4 className="about-subhead">{t('about.dividendSubhead')}</h4>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('about.dividendProject') }} />
              <li dangerouslySetInnerHTML={{ __html: t('about.dividendContribution') }} />
              <li dangerouslySetInnerHTML={{ __html: t('about.dividendInstructor') }} />
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
