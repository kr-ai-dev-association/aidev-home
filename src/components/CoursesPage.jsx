import React from 'react';
import coursesHeroBg from '../assets/social ai top.png';
import ServiceIcon from './ServiceIcon';
import { useI18n } from '../i18n/I18nProvider';

// 강의 — 바이브코딩대학 AX 챔피언 프로그램 소개 페이지 (다크 프리미엄 테마)
// 출처: 바이브코딩대학 AX 챔피언 프로그램 소개서 / 서비스 패키지 안내
const CONTACT = 'tonymustbegreat@gmail.com';

function CoursesPage({ onNavigate, onB2BRequest }) {
  const { t } = useI18n();
  const phases = [
    { tag: t('courses.phase1Tag'), title: t('courses.phase1Title'), desc: t('courses.phase1Desc') },
    { tag: t('courses.phase2Tag'), title: t('courses.phase2Title'), desc: t('courses.phase2Desc') },
    { tag: t('courses.phase3Tag'), title: t('courses.phase3Title'), desc: t('courses.phase3Desc') },
  ];

  const curriculum = [
    { name: 'edu', title: t('courses.curr1Title'), desc: t('courses.curr1Desc') },
    { name: 'developer', title: t('courses.curr2Title'), desc: t('courses.curr2Desc') },
    { name: 'eval', title: t('courses.curr3Title'), desc: t('courses.curr3Desc') },
  ];

  const tiers = [
    {
      tier: t('courses.tier1Tier'), title: t('courses.tier1Title'), duration: t('courses.tier1Duration'), featured: false,
      features: [t('courses.tier1Feat1'), t('courses.tier1Feat2'), t('courses.tier1Feat3'), t('courses.tier1Feat4')],
    },
    {
      tier: t('courses.tier2Tier'), title: t('courses.tier2Title'), duration: t('courses.tier2Duration'), featured: true, badge: t('courses.tier2Badge'),
      features: [t('courses.tier2Feat1'), t('courses.tier2Feat2'), t('courses.tier2Feat3'), t('courses.tier2Feat4'), t('courses.tier2Feat5')],
    },
    {
      tier: t('courses.tier3Tier'), title: t('courses.tier3Title'), duration: t('courses.tier3Duration'), featured: false,
      features: [t('courses.tier3Feat1'), t('courses.tier3Feat2'), t('courses.tier3Feat3'), t('courses.tier3Feat4')],
    },
  ];

  const steps = [
    { no: t('courses.step1No'), title: t('courses.step1Title'), dur: t('courses.step1Dur') },
    { no: t('courses.step2No'), title: t('courses.step2Title'), dur: t('courses.step2Dur') },
    { no: t('courses.step3No'), title: t('courses.step3Title'), dur: t('courses.step3Dur') },
    { no: t('courses.step4No'), title: t('courses.step4Title'), dur: t('courses.step4Dur') },
    { no: t('courses.step5No'), title: t('courses.step5Title'), dur: t('courses.step5Dur') },
    { no: t('courses.step6No'), title: t('courses.step6Title'), dur: t('courses.step6Dur') },
  ];

  return (
    <div className="home-landing courses-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${coursesHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">{t('courses.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('courses.heroTitleHtml') }} />
          <p>{t('courses.heroDesc')}</p>
          <div className="hero-actions">
            <button type="button" className="cta-button" onClick={() => onB2BRequest('조합 B2B 견적 문의')}>{t('courses.ctaQuote')}</button>
            <button className="ghost-button" onClick={() => onNavigate('signup')}>{t('courses.ctaSignup')}</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 바이브코딩대학은? */}
        <section className="section-services">
          <h3>{t('courses.aboutTitle')}</h3>
          <p className="section-lead">{t('courses.aboutLead')}</p>
          <div className="service-cards cards-row-3">
            <div className="service-card">
              <ServiceIcon name="developer" />
              <h4>{t('courses.aboutCard1Title')}</h4>
              <p>{t('courses.aboutCard1Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>{t('courses.aboutCard2Title')}</h4>
              <p>{t('courses.aboutCard2Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2c" />
              <h4>{t('courses.aboutCard3Title')}</h4>
              <p>{t('courses.aboutCard3Desc')}</p>
            </div>
          </div>
        </section>

        {/* 세 단계로 AI Native */}
        <section className="section-services">
          <h3>{t('courses.threeStepTitle')}</h3>
          <p className="section-lead">{t('courses.threeStepLead')}</p>
          <div className="service-cards cards-row-3">
            {phases.map((p) => (
              <div className="service-card" key={p.tag}>
                <span className="track-badge">{p.tag}</span>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="employment-bridge" dangerouslySetInnerHTML={{ __html: t('courses.threeStepBridgeHtml') }} />
        </section>

        {/* 교육 구성 */}
        <section className="section-services">
          <h3>{t('courses.eduTitle')}</h3>
          <p className="section-lead">{t('courses.eduLead')}</p>
          <div className="service-cards cards-row-3">
            {curriculum.map((c) => (
              <div className="service-card" key={c.title}>
                <ServiceIcon name={c.name} />
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3가지 패키지 */}
        <section className="section-services">
          <h3>{t('courses.pkgTitle')}</h3>
          <p className="section-lead">{t('courses.pkgLead')}</p>
          <div className="course-tiers">
            {tiers.map((t2) => (
              <div className={`course-tier${t2.featured ? ' featured' : ''}`} key={t2.tier}>
                <div className="tier-head">
                  <span className="tier-badge">{t2.tier}</span>
                  {t2.badge && <span className="tier-main">{t2.badge}</span>}
                </div>
                <h4 className="tier-title">{t2.title}</h4>
                <ul className="tier-features">
                  {t2.features.map((f, i) => (
                    <li key={i} className={f.startsWith('—') ? 'tier-sub' : ''}>{f}</li>
                  ))}
                </ul>
                <div className="tier-duration">{t2.duration}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 6단계 프로세스 */}
        <section className="section-services">
          <h3>{t('courses.processTitle')}</h3>
          <p className="section-lead">{t('courses.processLead')}</p>
          <div className="course-steps">
            {steps.map((s) => (
              <div className="course-step" key={s.no}>
                <span className="step-no">{s.no}</span>
                <strong className="step-title">{s.title}</strong>
                {s.dur && <span className="step-dur">{s.dur}</span>}
              </div>
            ))}
          </div>
          <p className="employment-bridge" dangerouslySetInnerHTML={{ __html: t('courses.processBridgeHtml') }} />
        </section>

        {/* CTA */}
        <section className="section-join-us">
          <h3>{t('courses.ctaTitle')}</h3>
          <p className="section-lead">{t('courses.ctaLead')}</p>
          <button type="button" className="cta-button" onClick={() => onB2BRequest('조합 B2B 견적 문의')}>{t('courses.ctaQuote')}</button>
        </section>
      </div>
    </div>
  );
}

export default CoursesPage;
