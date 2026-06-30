import React from 'react';
import './MediationPage.css';
import disputeHeroBg from '../assets/lawyer.png';
import ServiceIcon from './ServiceIcon';
import { useI18n } from '../i18n/I18nProvider';

// 분쟁 조정 소개 — 외주 프로젝트 분쟁 + 노동·계약 분쟁 조정 안내 (AgentBuildPage 와 동일 스타일)
function DisputeServicePage({ onNavigate, isLoggedIn }) {
  const { t } = useI18n();
  // 조합이 함께 해결하는 분쟁 영역
  const domains = [
    { name: 'jobseeker', title: t('disputeService.domain1Title'), desc: t('disputeService.domain1Desc') },
    { name: 'developer', title: t('disputeService.domain2Title'), desc: t('disputeService.domain2Desc') },
    { name: 'infra', title: t('disputeService.domain3Title'), desc: t('disputeService.domain3Desc') },
    { name: 'check', title: t('disputeService.domain4Title'), desc: t('disputeService.domain4Desc') },
  ];

  // 분쟁 조정 절차
  const pipeline = [
    { name: 'developer', title: t('disputeService.pipe1Title'), desc: t('disputeService.pipe1Desc') },
    { name: 'eval', title: t('disputeService.pipe2Title'), desc: t('disputeService.pipe2Desc') },
    { name: 'shield', title: t('disputeService.pipe3Title'), desc: t('disputeService.pipe3Desc') },
    { name: 'check', title: t('disputeService.pipe4Title'), desc: t('disputeService.pipe4Desc') },
  ];

  // 위장도급(다단계 비정규직) 설명 포인트
  const disguised = [
    t('disputeService.disguised1'),
    t('disputeService.disguised2'),
    t('disputeService.disguised3'),
    t('disputeService.disguised4'),
  ];

  const categories = [
    t('disputeService.cat1'),
    t('disputeService.cat2'),
    t('disputeService.cat3'),
    t('disputeService.cat4'),
    t('disputeService.cat5'),
    t('disputeService.cat6'),
    t('disputeService.cat7'),
    t('disputeService.cat8'),
    t('disputeService.cat9'),
  ];

  const flowLabels = [
    t('disputeService.flow1'),
    t('disputeService.flow2'),
    t('disputeService.flow3'),
    t('disputeService.flow4'),
    t('disputeService.flow5'),
    t('disputeService.flow6'),
  ];

  return (
    <div className="home-landing agentbuild-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${disputeHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">{t('disputeService.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('disputeService.heroTitleHtml') }} />
          <p dangerouslySetInnerHTML={{ __html: t('disputeService.heroDescHtml') }} />
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate(isLoggedIn ? 'mediation' : 'signup')}>{t('disputeService.ctaRequest')}</button>
            <button className="ghost-button" onClick={() => onNavigate('signup')}>{t('disputeService.ctaSignup')}</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 조합이 함께 해결하는 분쟁 */}
        <section className="section-services">
          <h3>{t('disputeService.solveTitle')}</h3>
          <p className="section-lead">{t('disputeService.solveLead')}</p>
          <div className="service-cards cards-row-4">
            {domains.map((d) => (
              <div className="service-card" key={d.title}>
                <ServiceIcon name={d.name} />
                <h4>{d.title}</h4>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 다루는 분쟁 유형 */}
        <section className="section-services">
          <h3>{t('disputeService.typesTitle')}</h3>
          <p className="section-lead">{t('disputeService.typesLead')}</p>
          <div className="med-cat-grid">
            {categories.map((c) => (
              <span className="med-cat-tile" key={c}>{c}</span>
            ))}
          </div>

          {/* 위장도급 강조 패널 */}
          <div className="vote-panel">
            <div className="vote-panel-head">
              <span className="vote-badge">{t('disputeService.spotlightBadge')}</span>
              <h4>{t('disputeService.spotlightTitle')}</h4>
              <p dangerouslySetInnerHTML={{ __html: t('disputeService.spotlightDescHtml') }} />
            </div>
            <ul className="med-disguised-list">
              {disguised.map((p) => <li key={p}><span className="md-check">✓</span>{p}</li>)}
            </ul>
          </div>
        </section>

        {/* 조정 절차 파이프라인 */}
        <section className="section-services">
          <h3>{t('disputeService.procTitle')}</h3>
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('disputeService.procLeadHtml') }} />
          <div className="verify-pipeline">
            {pipeline.map((s, i) => (
              <React.Fragment key={s.title}>
                <div className="vp-node">
                  <div className="vp-icon"><ServiceIcon name={s.name} /></div>
                  <span className="vp-step">STEP {i + 1}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="vp-connector" aria-hidden="true"><span className="vp-line" /><span className="vp-chevron">›</span></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <blockquote className="harness-quote">{t('disputeService.procQuote')}</blockquote>
        </section>

        {/* 두 갈래의 분쟁 조정 */}
        <section className="section-services">
          <h3>{t('disputeService.twoTrackTitle')}</h3>
          <p className="section-lead">{t('disputeService.twoTrackLead')}</p>
          <div className="service-cards cards-row-2">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>{t('disputeService.track1Title')}</h4>
              <p dangerouslySetInnerHTML={{ __html: t('disputeService.track1DescHtml') }} />
              <button className="ghost-button small" onClick={() => onNavigate('employment')}>{t('disputeService.track1Btn')}</button>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>{t('disputeService.track2Title')}</h4>
              <p dangerouslySetInnerHTML={{ __html: t('disputeService.track2DescHtml') }} />
              <button className="cta-button small" onClick={() => onNavigate(isLoggedIn ? 'mediation' : 'signup')}>{t('disputeService.track2Btn')}</button>
            </div>
          </div>
        </section>

        {/* 의뢰 방법 가이드 */}
        <section className="section-services">
          <h3>{t('disputeService.guideTitle')}</h3>
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('disputeService.guideLeadHtml') }} />
          <div className="flow-strip" aria-hidden="true">
            {flowLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="fs-item"><span className="fs-num">{i + 1}</span><span className="fs-label">{label}</span></div>
                {i < 5 && <span className="fs-arrow">›</span>}
              </React.Fragment>
            ))}
          </div>

          <ol className="guide-steps">
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 1</span>
                <h4>{t('disputeService.step1Title')}</h4>
                <p dangerouslySetInnerHTML={{ __html: t('disputeService.step1DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('disputeService.shotAddrProfile')}</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-input">{t('disputeService.shotMyInfo')}</span>
                  <span className="shot-input active">{t('disputeService.shotDisputeRequest')}</span>
                  <span className="shot-input">{t('disputeService.shotMyApplications')}</span>
                  <span className="shot-input">{t('disputeService.shotMyPosts')}</span>
                </div>
              </div>
            </li>
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 2</span>
                <h4>{t('disputeService.step2Title')}</h4>
                <p>{t('disputeService.step2Desc')}</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('disputeService.shotAddrDispute')}</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-label">{t('disputeService.labelClientType')}</span>
                  <div className="shot-tabs"><span className="shot-tab active">{t('disputeService.tabWorker')}</span><span className="shot-tab">{t('disputeService.tabFreelancer')}</span><span className="shot-tab">{t('disputeService.tabSelfEmployed')}</span></div>
                  <span className="shot-label">{t('disputeService.labelDisputeType')}</span>
                  <span className="shot-input">{t('disputeService.inputDisputeType')}</span>
                  <span className="shot-label">{t('disputeService.labelDisputeDetail')}</span>
                  <span className="shot-input tall">{t('disputeService.inputDisputeDetailPlaceholder')}</span>
                </div>
              </div>
            </li>
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 3</span>
                <h4>{t('disputeService.step3Title')}</h4>
                <p dangerouslySetInnerHTML={{ __html: t('disputeService.step3DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('disputeService.shotAddrStatus')}</span></div>
                <div className="shot-body">
                  <div className="shot-toast">{t('disputeService.toastReceived')}</div>
                  <div className="shot-card"><span className="shot-card-badge cyan">{t('disputeService.cardBadgeExpert')}</span><span className="shot-card-title">{t('disputeService.cardTitleExpert')}</span><span className="shot-card-meta">{t('disputeService.cardMetaExpert')}</span></div>
                  <div className="shot-match"><span className="shot-avatar" /><span className="shot-match-text" dangerouslySetInnerHTML={{ __html: t('disputeService.matchTextHtml') }} /></div>
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* CTA */}
        <section className="section-join-us">
          <h3>{t('disputeService.ctaTitle')}</h3>
          <p className="section-lead">{t('disputeService.ctaLead')}</p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate(isLoggedIn ? 'mediation' : 'signup')}>{isLoggedIn ? t('disputeService.ctaLoggedIn') : t('disputeService.ctaLoggedOut')}</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DisputeServicePage;
