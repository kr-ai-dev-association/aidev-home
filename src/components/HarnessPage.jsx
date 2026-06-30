import React from 'react';
import harnessHeroBg from '../assets/ai dev backgound.png';
import ServiceIcon from './ServiceIcon';
import { useI18n } from '../i18n/I18nProvider';

// 에이전트 하네스 (Banya Agent Harness) 소개 페이지 — 다크 프리미엄 테마
// 출처: Banya Agent Harness — 개요 (tony.banya.ai)
function HarnessPage({ onNavigate }) {
  const { t } = useI18n();
  const guarantees = [
    { name: 'check', title: t('harness.guarantee1Title'), desc: t('harness.guarantee1Desc') },
    { name: 'infra', title: t('harness.guarantee2Title'), desc: t('harness.guarantee2Desc') },
    { name: 'shield', title: t('harness.guarantee3Title'), desc: t('harness.guarantee3Desc') },
    { name: 'eval', title: t('harness.guarantee4Title'), desc: t('harness.guarantee4Desc') },
    { name: 'developer', title: t('harness.guarantee5Title'), desc: t('harness.guarantee5Desc') },
  ];

  const operations = [
    { name: 'check', title: t('harness.operation1Title'), desc: t('harness.operation1Desc') },
    { name: 'edu', title: t('harness.operation2Title'), desc: t('harness.operation2Desc') },
    { name: 'eval', title: t('harness.operation3Title'), desc: t('harness.operation3Desc') },
    { name: 'shield', title: t('harness.operation4Title'), desc: t('harness.operation4Desc') },
    { name: 'infra', title: t('harness.operation5Title'), desc: t('harness.operation5Desc') },
    { name: 'b2b', title: t('harness.operation6Title'), desc: t('harness.operation6Desc') },
  ];

  const compare = [
    [t('harness.compareR1C1'), t('harness.compareR1C2'), t('harness.compareR1C3')],
    [t('harness.compareR2C1'), t('harness.compareR2C2'), t('harness.compareR2C3')],
    [t('harness.compareR3C1'), t('harness.compareR3C2'), t('harness.compareR3C3')],
    [t('harness.compareR4C1'), t('harness.compareR4C2'), t('harness.compareR4C3')],
    [t('harness.compareR5C1'), t('harness.compareR5C2'), t('harness.compareR5C3')],
    [t('harness.compareR6C1'), t('harness.compareR6C2'), t('harness.compareR6C3')],
    [t('harness.compareR7C1'), t('harness.compareR7C2'), t('harness.compareR7C3')],
    [t('harness.compareR8C1'), t('harness.compareR8C2'), t('harness.compareR8C3')],
  ];

  return (
    <div className="home-landing harness-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${harnessHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">{t('harness.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('harness.heroTitleHtml') }} />
          <p>{t('harness.heroDesc')}</p>
          <div className="hero-actions">
            <a className="cta-button" href="https://github.com/kr-ai-dev-association/harness-collection" target="_blank" rel="noopener noreferrer">{t('harness.githubView')}</a>
            <button className="ghost-button" onClick={() => onNavigate('agenteval')}>{t('harness.viewEval')}</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 정의: Agent = Model + Harness */}
        <section className="section-services">
          <h3>{t('harness.equationTitle')}</h3>
          <div className="harness-equation">Agent&nbsp;&nbsp;=&nbsp;&nbsp;Model&nbsp;&nbsp;+&nbsp;&nbsp;Harness</div>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="developer" />
              <span className="track-badge">{t('harness.badgeModel')}</span>
              <h4>{t('harness.modelCardTitle')}</h4>
              <p>{t('harness.modelCardDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <span className="track-badge">{t('harness.badgeHarness')}</span>
              <h4>{t('harness.harnessCardTitle')}</h4>
              <p>{t('harness.harnessCardDesc')}</p>
            </div>
          </div>
          <blockquote className="harness-quote">{t('harness.equationQuote')}</blockquote>
        </section>

        {/* 무엇을 보장하는가 */}
        <section className="section-services">
          <h3>{t('harness.guaranteeTitle')}</h3>
          <p className="section-lead">{t('harness.guaranteeLead')}</p>
          <div className="service-cards cards-row-5">
            {guarantees.map((g) => (
              <div className="service-card" key={g.title}>
                <ServiceIcon name={g.name} />
                <h4>{g.title}</h4>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
          <blockquote className="harness-quote">{t('harness.guaranteeQuote')}</blockquote>
        </section>

        {/* 설계 가이드: Framework vs Harness */}
        <section className="section-services">
          <h3>{t('harness.frameworkTitle')}</h3>
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('harness.frameworkLeadHtml') }} />
          <div className="harness-compare-wrap">
            <table className="harness-compare">
              <thead>
                <tr>
                  <th>{t('harness.compareColAxis')}</th>
                  <th>{t('harness.compareColFramework')}</th>
                  <th>{t('harness.compareColOurs')}</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr key={row[0]}>
                    <td className="compare-axis">{row[0]}</td>
                    <td>{row[1]}</td>
                    <td className="compare-ours">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="harness-quote">{t('harness.frameworkQuote')}</blockquote>
        </section>

        {/* 운영 관점 특성 */}
        <section className="section-services">
          <h3>{t('harness.operationTitle')}</h3>
          <p className="section-lead">{t('harness.operationLead')}</p>
          <div className="service-cards cards-row-3">
            {operations.map((o) => (
              <div className="service-card" key={o.title}>
                <ServiceIcon name={o.name} />
                <h4>{o.title}</h4>
                <p>{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 구조와 방법론 */}
        <section className="section-services">
          <h3>{t('harness.structureTitle')}</h3>
          <p className="section-lead">{t('harness.structureLead')}</p>
          <pre className="harness-tree">{`python/
  fastapi_guard.py        # 코드 (단일 파일 하네스)
  fastapi_guard.md        # 동명 스킬 문서 (얇음)
nodejs/
  e2e-llm-harness/        # 디렉터리 하네스
    e2e-harness           # 코드
    e2e-llm-harness.md    # 동명 문서 (디렉터리 안)`}</pre>
        </section>

        {/* CTA */}
        <section className="section-join-us">
          <h3>{t('harness.ctaTitle')}</h3>
          <p className="section-lead">{t('harness.ctaLead')}</p>
          <button className="cta-button" onClick={() => onNavigate('signup')}>{t('harness.ctaJoin')}</button>
        </section>
      </div>
    </div>
  );
}

export default HarnessPage;
