import React from 'react';
import evalHeroBg from '../assets/data center.jpg';
import ServiceIcon from './ServiceIcon';

// 에이전트 평가 (Prototypebench) 소개 페이지 — 다크 프리미엄 테마
function AgentEvalPage({ onNavigate, onB2BRequest }) {
  const stats = [
    { num: '123', label: '평가 인스턴스 (실제 PR 기반)' },
    { num: '32,885', label: '테스트 케이스' },
    { num: '940', label: 'fail-to-pass 검증' },
    { num: '0', label: 'LLM 심판 (100% 실행 기반)' },
  ];

  const stack = ['React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'FastAPI', 'SQLModel', 'pytest', 'Playwright', 'Docker'];

  const phases = [
    { mark: '✅', title: 'Phase 1 · 태스크 큐레이션', desc: '실제 PR에서 채굴한 123개 인스턴스 확보' },
    { mark: '✅', title: 'Phase 2 · 평가 하니스', desc: 'pytest + Playwright + Docker 실행 환경 구축' },
    { mark: '🟢', title: 'Phase 3 · 내부 베타', desc: '레퍼런스 에이전트-루프 러너 가동' },
    { mark: '⏳', title: 'Phase 4 · 공개 리더보드', desc: '시즌제 held-out 세트로 공정 경쟁' },
    { mark: '⏳', title: 'Phase 5 · 지속 갱신', desc: '신규 PR 기반 태스크 상시 리프레시' },
  ];

  return (
    <div className="home-landing eval-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${evalHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">AI 에이전트 평가 · PROTOTYPEBENCH</span>
          <h2>AI 코딩 에이전트를<br />실제 실행으로 검증합니다</h2>
          <p>
            Prototypebench는 AI 에이전트가 현업 수준의 풀스택 기능을 끝까지 구현할 수 있는지 측정하는 오픈 벤치마크입니다.
            LLM 심판이 아닌 실제 테스트 실행으로 성능·정확성을 객관적으로 평가합니다.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onB2BRequest('조합 B2B 평가 신청')}>조합 B2B 평가 신청</button>
            <a className="ghost-button" href="https://github.com/prototypebench" target="_blank" rel="noopener noreferrer">GitHub 보기</a>
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
          <h3>무엇을 측정하나</h3>
          <p className="section-lead">
            단순 버그 수정이 아닌, 현업 제품 개발 워크플로우 — 백엔드와 프론트엔드를 가로지르는 완결된 기능 구현을 평가합니다.
          </p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>백엔드 기능 구현</h4>
              <p>FastAPI + SQLModel 기반의 API·데이터 모델을 요구사항대로 구현하는 능력을 검증합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="developer" />
              <h4>프론트엔드 구현</h4>
              <p>React + Vite + Tailwind CSS + shadcn/ui로 동작하는 UI 컴포넌트를 완성하는 능력을 평가합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>E2E 동작 · 무회귀</h4>
              <p>두 계층이 끝까지 연결되어 동작하는지, 기존 테스트 스위트를 깨뜨리지 않는지까지 확인합니다.</p>
            </div>
          </div>
        </section>

        {/* 평가 방법론 */}
        <section className="section-services">
          <h3>평가 방법론</h3>
          <p className="section-lead">
            정답은 실제로 머지된 PR diff. 사람이나 LLM의 주관이 아닌, 테스트 실행 결과가 유일한 심판입니다.
          </p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>실행 기반 채점</h4>
              <p>LLM-as-judge를 쓰지 않습니다. pytest와 Playwright가 객관적 심판이 되어 실제 통과 여부로 채점합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>이진(Binary) 점수</h4>
              <p>fail-to-pass 테스트를 모두 통과하고, regression-guard 테스트가 전부 유지될 때만 1점을 부여합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <h4>듀얼 러너 · 헤르메틱</h4>
              <p>백엔드는 Docker pytest, 프론트는 Playwright + Xvfb로 격리 실행해 재현 가능한 결과를 보장합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>데이터 오염 방어</h4>
              <p>모델 학습 컷오프 기준으로 held-out 세트를 시즌마다 로테이션하고, 컷오프 공개를 의무화해 공정성을 지킵니다.</p>
            </div>
          </div>
        </section>

        {/* 기술 스택 */}
        <section className="section-eval-stack">
          <h3>평가 대상 기술 스택</h3>
          <p className="section-lead">2024년 각 카테고리 1위 스택으로 구성된, 현업에 가장 가까운 환경에서 검증합니다.</p>
          <ul className="eval-stack-list">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {/* 로드맵(페이즈) */}
        <section className="section-eval-phases">
          <h3>오픈 벤치마크 로드맵</h3>
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
          <p className="section-lead eval-dataset">
            데이터셋은 Hugging Face <code>banyaaiofficial/prototypebench-v1</code>에서 MIT 라이선스로 공개됩니다.
          </p>
        </section>

        {/* CTA — 조합 B2B 연계 */}
        <section className="section-join-us">
          <h3>기업 맞춤형 에이전트 평가 리포트가 필요하신가요?</h3>
          <p className="section-lead">
            한국인공지능개발자 협동조합은 Prototypebench와 연계해 기업의 자체 AI 에이전트를 성능·추론속도·환각·안전성 관점에서 검증하고 공인 평가 리포트를 발급합니다.
          </p>
          <button className="cta-button" onClick={() => onB2BRequest('조합 B2B 평가 신청')}>조합 B2B 평가 신청</button>
        </section>
      </div>
    </div>
  );
}

export default AgentEvalPage;
