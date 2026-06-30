import React from 'react';
import buildHeroBg from '../assets/ict outsource.png';
import ServiceIcon from './ServiceIcon';
import { useI18n } from '../i18n/I18nProvider';

// 에이전트 구축 — 취업 매칭 플랫폼을 통한 직접 프로젝트 의뢰 안내 페이지 (다크 프리미엄 테마)
// 메시지: 검증된 조합원과의 매칭으로 AI 에이전트 구축 프로젝트를 성공적으로 수행
function AgentBuildPage({ onNavigate, isLoggedIn }) {
  const { t } = useI18n();
  // 검증된 조합원과 매칭되는 이유
  const values = [
    { name: 'check', title: t('agentbuild.value1Title'), desc: t('agentbuild.value1Desc') },
    { name: 'shield', title: t('agentbuild.value2Title'), desc: t('agentbuild.value2Desc') },
    { name: 'developer', title: t('agentbuild.value3Title'), desc: t('agentbuild.value3Desc') },
    { name: 'eval', title: t('agentbuild.value4Title'), desc: t('agentbuild.value4Desc') },
  ];

  // 조합원 검증 파이프라인 (활동 → 평가 → 투표 → 검증)
  const verifyPipeline = [
    { name: 'developer', title: t('agentbuild.pipe1Title'), desc: t('agentbuild.pipe1Desc') },
    { name: 'eval', title: t('agentbuild.pipe2Title'), desc: t('agentbuild.pipe2Desc') },
    { name: 'check', title: t('agentbuild.pipe3Title'), desc: t('agentbuild.pipe3Desc') },
    { name: 'shield', title: t('agentbuild.pipe4Title'), desc: t('agentbuild.pipe4Desc') },
  ];

  const flowLabels = [
    t('agentbuild.flow1'),
    t('agentbuild.flow2'),
    t('agentbuild.flow3'),
    t('agentbuild.flow4'),
    t('agentbuild.flow5'),
    t('agentbuild.flow6'),
  ];

  return (
    <div className="home-landing agentbuild-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${buildHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">{t('agentbuild.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('agentbuild.heroTitleHtml') }} />
          <p>{t('agentbuild.heroDesc')}</p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate('employment')}>{t('agentbuild.ctaRequest')}</button>
            <button className="ghost-button" onClick={() => onNavigate('signup')}>{t('agentbuild.ctaSignup')}</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 왜 검증된 조합원과 매칭되는가 */}
        <section className="section-services">
          <h3>{t('agentbuild.matchTitle')}</h3>
          <p className="section-lead">{t('agentbuild.matchLead')}</p>
          <div className="service-cards cards-row-4">
            {values.map((v) => (
              <div className="service-card" key={v.title}>
                <ServiceIcon name={v.name} />
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 검증은 어떻게 이루어지는가 — 활동 평가 + 투표 시스템 */}
        <section className="section-services">
          <h3>{t('agentbuild.verifyTitle')}</h3>
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('agentbuild.verifyLeadHtml') }} />
          {/* 인포그래픽: 검증 파이프라인 */}
          <div className="verify-pipeline">
            {verifyPipeline.map((s, i) => (
              <React.Fragment key={s.title}>
                <div className="vp-node">
                  <div className="vp-icon"><ServiceIcon name={s.name} /></div>
                  <span className="vp-step">STEP {i + 1}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
                {i < verifyPipeline.length - 1 && (
                  <div className="vp-connector" aria-hidden="true">
                    <span className="vp-line" />
                    <span className="vp-chevron">›</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 인포그래픽: 투표 시스템 결과 시각화 */}
          <div className="vote-panel">
            <div className="vote-panel-head">
              <span className="vote-badge">{t('agentbuild.voteBadge')}</span>
              <h4>{t('agentbuild.votePanelTitle')}</h4>
              <p dangerouslySetInnerHTML={{ __html: t('agentbuild.votePanelDescHtml') }} />
            </div>
            <div className="vote-panel-viz">
              {/* 안건 + 찬반 집계 */}
              <div className="vote-ballot">
                <div className="vb-head">
                  <span className="vb-name">{t('agentbuild.ballotName')}</span>
                  <span className="vb-tag">{t('agentbuild.ballotTag')}</span>
                </div>
                <div className="vb-bar">
                  <span className="vb-bar-label">{t('agentbuild.ballotApprove')}</span>
                  <span className="vb-track"><span className="vb-fill approve" style={{ width: '82%' }} /></span>
                  <span className="vb-pct">82%</span>
                </div>
                <div className="vb-bar">
                  <span className="vb-bar-label">{t('agentbuild.ballotReject')}</span>
                  <span className="vb-track"><span className="vb-fill reject" style={{ width: '18%' }} /></span>
                  <span className="vb-pct">18%</span>
                </div>
                <div className="vb-meta">{t('agentbuild.ballotMeta')}</div>
              </div>
              {/* 승인 도넛 */}
              <div className="vote-ring" role="img" aria-label={t('agentbuild.ringAria')}>
                <svg viewBox="0 0 120 120">
                  <circle className="ring-bg" cx="60" cy="60" r="50" />
                  <circle
                    className="ring-fg"
                    cx="60"
                    cy="60"
                    r="50"
                    strokeDasharray="314.16"
                    strokeDashoffset="56.5"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="vote-ring-label">
                  <strong>82%</strong>
                  <span>{t('agentbuild.ringLabel')}</span>
                </div>
              </div>
            </div>
          </div>

          <blockquote className="harness-quote">{t('agentbuild.verifyQuote')}</blockquote>
        </section>

        {/* 조합 내 투표 시스템 소개 */}
        <section className="section-services">
          <h3>{t('agentbuild.voteSysTitle')}</h3>
          <p className="section-lead">{t('agentbuild.voteSysLead')}</p>
          <div className="service-cards cards-row-3">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>{t('agentbuild.voteSysCard1Title')}</h4>
              <p>{t('agentbuild.voteSysCard1Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>{t('agentbuild.voteSysCard2Title')}</h4>
              <p>{t('agentbuild.voteSysCard2Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>{t('agentbuild.voteSysCard3Title')}</h4>
              <p>{t('agentbuild.voteSysCard3Desc')}</p>
            </div>
          </div>
          <p className="section-lead section-note">{t('agentbuild.voteSysNote')}</p>
        </section>

        {/* 취업 메뉴에서 프로젝트 만드는 방법 — 단계별 가이드 + 스크린샷 */}
        <section className="section-services">
          <h3>{t('agentbuild.guideTitle')}</h3>
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('agentbuild.guideLeadHtml') }} />

          {/* 흐름 요약 스트립 */}
          <div className="flow-strip" aria-hidden="true">
            {flowLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="fs-item">
                  <span className="fs-num">{i + 1}</span>
                  <span className="fs-label">{label}</span>
                </div>
                {i < 5 && <span className="fs-arrow">›</span>}
              </React.Fragment>
            ))}
          </div>

          <ol className="guide-steps">
            {/* STEP 1 */}
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 1</span>
                <h4>{t('agentbuild.step1Title')}</h4>
                <p>{t('agentbuild.step1Desc')}</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('agentbuild.shotAddrHome')}</span></div>
                <div className="shot-body shot-topbar">
                  <span className="shot-logo">{t('agentbuild.shotLogo')}</span>
                  <span className="shot-spacer" />
                  <span className="shot-btn">{t('agentbuild.shotBtnLogin')}</span>
                  <span className="shot-btn primary">{t('agentbuild.shotBtnSignup')}</span>
                </div>
              </div>
            </li>

            {/* STEP 2 */}
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 2</span>
                <h4 dangerouslySetInnerHTML={{ __html: t('agentbuild.step2TitleHtml') }} />
                <p dangerouslySetInnerHTML={{ __html: t('agentbuild.step2DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('agentbuild.shotAddrHome')}</span></div>
                <div className="shot-body shot-nav">
                  <span className="shot-nav-item">{t('agentbuild.navIntro')}</span>
                  <span className="shot-nav-item">{t('agentbuild.navBiz')}</span>
                  <span className="shot-nav-item">{t('agentbuild.navHarness')}</span>
                  <span className="shot-nav-item active">{t('agentbuild.navEmployment')}</span>
                  <span className="shot-nav-item">{t('agentbuild.navCommunity')}</span>
                </div>
              </div>
            </li>

            {/* STEP 3 */}
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 3</span>
                <h4 dangerouslySetInnerHTML={{ __html: t('agentbuild.step3TitleHtml') }} />
                <p dangerouslySetInnerHTML={{ __html: t('agentbuild.step3DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('agentbuild.shotAddrEmployment')}</span></div>
                <div className="shot-body">
                  <div className="shot-tabs">
                    <span className="shot-tab active">{t('agentbuild.tabAll')}</span>
                    <span className="shot-tab">{t('agentbuild.tabRecruit')}</span>
                    <span className="shot-tab">{t('agentbuild.tabProjectHire')}</span>
                    <span className="shot-tab">{t('agentbuild.tabOutsource')}</span>
                    <span className="shot-spacer" />
                    <span className="shot-btn primary glow">{t('agentbuild.btnPost')}</span>
                  </div>
                  <div className="shot-card">
                    <span className="shot-card-badge cyan">{t('agentbuild.cardBadgeOutsource')}</span>
                    <span className="shot-card-title">{t('agentbuild.card1Title')}</span>
                    <span className="shot-card-meta">{t('agentbuild.card1Meta')}</span>
                  </div>
                  <div className="shot-card">
                    <span className="shot-card-badge indigo">{t('agentbuild.cardBadgeHire')}</span>
                    <span className="shot-card-title">{t('agentbuild.card2Title')}</span>
                    <span className="shot-card-meta">{t('agentbuild.card2Meta')}</span>
                  </div>
                </div>
              </div>
            </li>

            {/* STEP 4 */}
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 4</span>
                <h4>{t('agentbuild.step4Title')}</h4>
                <p dangerouslySetInnerHTML={{ __html: t('agentbuild.step4DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('agentbuild.shotAddrPost')}</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-label">{t('agentbuild.labelType')}</span>
                  <div className="shot-dropdown">
                    <span className="shot-select open">{t('agentbuild.selectOutsourceOpen')}</span>
                    <ul className="shot-options">
                      <li dangerouslySetInnerHTML={{ __html: t('agentbuild.optRecruitHtml') }} />
                      <li dangerouslySetInnerHTML={{ __html: t('agentbuild.optHireHtml') }} />
                      <li className="active" dangerouslySetInnerHTML={{ __html: t('agentbuild.optOutsourceHtml') }} />
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            {/* STEP 5 */}
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 5</span>
                <h4>{t('agentbuild.step5Title')}</h4>
                <p dangerouslySetInnerHTML={{ __html: t('agentbuild.step5DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('agentbuild.shotAddrPost')}</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-label">{t('agentbuild.labelTitle')}</span>
                  <span className="shot-input">{t('agentbuild.inputTitle')}</span>
                  <span className="shot-label">{t('agentbuild.labelDesc')}</span>
                  <span className="shot-input tall">{t('agentbuild.inputDescPlaceholder')}</span>
                  <div className="shot-grid2">
                    <div><span className="shot-label">{t('agentbuild.labelBudget')}</span><span className="shot-input">{t('agentbuild.inputBudget')}</span></div>
                    <div><span className="shot-label">{t('agentbuild.labelDuration')}</span><span className="shot-input">{t('agentbuild.inputDuration')}</span></div>
                  </div>
                  <span className="shot-label">{t('agentbuild.labelScreenshot')}</span>
                  <span className="shot-upload">{t('agentbuild.uploadImage')}</span>
                </div>
              </div>
            </li>

            {/* STEP 6 */}
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 6</span>
                <h4>{t('agentbuild.step6Title')}</h4>
                <p dangerouslySetInnerHTML={{ __html: t('agentbuild.step6DescHtml') }} />
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">{t('agentbuild.shotAddrPost')}</span></div>
                <div className="shot-body">
                  <div className="shot-toast">{t('agentbuild.toastPosted')}</div>
                  <div className="shot-submit">
                    <span className="shot-btn ghost">{t('agentbuild.btnCancel')}</span>
                    <span className="shot-btn primary">{t('agentbuild.btnSubmit')}</span>
                  </div>
                  <div className="shot-match">
                    <span className="shot-avatar" />
                    <span className="shot-match-text" dangerouslySetInnerHTML={{ __html: t('agentbuild.matchTextHtml') }} />
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* CTA — 조합원 가입 안내 */}
        <section className="section-join-us">
          <h3>{t('agentbuild.ctaTitle')}</h3>
          <p className="section-lead">{t('agentbuild.ctaLead')}</p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate('signup')}>{t('agentbuild.ctaJoin')}</button>
            {isLoggedIn && (
              <button className="ghost-button" onClick={() => onNavigate('employment')}>{t('agentbuild.ctaEmployment')}</button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AgentBuildPage;
