import React from 'react';
import evalHeroBg from '../assets/data center.jpg';
import ServiceIcon from './ServiceIcon';
import { useI18n } from '../i18n/I18nProvider';

// 에이전트 평가 (Prototypebench) 소개 페이지 — 다크 프리미엄 테마
function AgentEvalPage({ onNavigate, onB2BRequest }) {
  const { t } = useI18n();
  const stats = [
    { num: '123', label: t('agenteval.statLabel1') },
    { num: '32,885', label: t('agenteval.statLabel2') },
    { num: '940', label: t('agenteval.statLabel3') },
    { num: '0', label: t('agenteval.statLabel4') },
  ];

  const stack = ['React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'FastAPI', 'SQLModel', 'pytest', 'Playwright', 'Docker'];

  const phases = [
    { mark: '✅', title: t('agenteval.phase1Title'), desc: t('agenteval.phase1Desc') },
    { mark: '✅', title: t('agenteval.phase2Title'), desc: t('agenteval.phase2Desc') },
    { mark: '🟢', title: t('agenteval.phase3Title'), desc: t('agenteval.phase3Desc') },
    { mark: '⏳', title: t('agenteval.phase4Title'), desc: t('agenteval.phase4Desc') },
    { mark: '⏳', title: t('agenteval.phase5Title'), desc: t('agenteval.phase5Desc') },
  ];

  return (
    <div className="home-landing eval-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${evalHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">{t('agenteval.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('agenteval.heroTitleHtml') }} />
          <p>{t('agenteval.heroDesc')}</p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onB2BRequest('조합 B2B 평가 신청')}>{t('agenteval.ctaB2B')}</button>
            <a className="ghost-button" href="https://github.com/prototypebench" target="_blank" rel="noopener noreferrer">{t('agenteval.githubView')}</a>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 통계 밴드 */}
        <section className="section-eval-stats">
          <div className="eval-stats">
            {stats.map((s) => (
              <div className="eval-stat" key={s.label}>
                <strong className="eval-stat-num">{s.num}</strong>
                <span className="eval-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 무엇을 측정하나 */}
        <section className="section-services">
          <h3>{t('agenteval.measureTitle')}</h3>
          <p className="section-lead">{t('agenteval.measureLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>{t('agenteval.measureCard1Title')}</h4>
              <p>{t('agenteval.measureCard1Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="developer" />
              <h4>{t('agenteval.measureCard2Title')}</h4>
              <p>{t('agenteval.measureCard2Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>{t('agenteval.measureCard3Title')}</h4>
              <p>{t('agenteval.measureCard3Desc')}</p>
            </div>
          </div>
        </section>

        {/* 평가 방법론 */}
        <section className="section-services">
          <h3>{t('agenteval.methodTitle')}</h3>
          <p className="section-lead">{t('agenteval.methodLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>{t('agenteval.methodCard1Title')}</h4>
              <p>{t('agenteval.methodCard1Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>{t('agenteval.methodCard2Title')}</h4>
              <p>{t('agenteval.methodCard2Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <h4>{t('agenteval.methodCard3Title')}</h4>
              <p>{t('agenteval.methodCard3Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>{t('agenteval.methodCard4Title')}</h4>
              <p>{t('agenteval.methodCard4Desc')}</p>
            </div>
          </div>
        </section>

        {/* 기술 스택 */}
        <section className="section-eval-stack">
          <h3>{t('agenteval.stackTitle')}</h3>
          <p className="section-lead">{t('agenteval.stackLead')}</p>
          <ul className="eval-stack-list">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {/* 로드맵(페이즈) */}
        <section className="section-eval-phases">
          <h3>{t('agenteval.roadmapTitle')}</h3>
          <div className="eval-phases">
            {phases.map((p) => (
              <div className="eval-phase" key={p.title}>
                <span className="eval-phase-mark">{p.mark}</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="section-lead eval-dataset" dangerouslySetInnerHTML={{ __html: t('agenteval.datasetHtml') }} />
        </section>

        {/* CTA — 조합 B2B 연계 */}
        <section className="section-join-us">
          <h3>{t('agenteval.ctaTitle')}</h3>
          <p className="section-lead">{t('agenteval.ctaLead')}</p>
          <button className="cta-button" onClick={() => onB2BRequest('조합 B2B 평가 신청')}>{t('agenteval.ctaB2B')}</button>
        </section>
      </div>
    </div>
  );
}

export default AgentEvalPage;
