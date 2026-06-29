import React from 'react';
import harnessHeroBg from '../assets/ai dev backgound.png';
import ServiceIcon from './ServiceIcon';

// 에이전트 하네스 (Banya Agent Harness) 소개 페이지 — 다크 프리미엄 테마
// 출처: Banya Agent Harness — 개요 (tony.banya.ai)
function HarnessPage({ onNavigate }) {
  const guarantees = [
    { name: 'check', title: '결정론 (Determinism)', desc: '모델 출력은 분포를 따르지만, 하네스의 검사·방어 경로는 입력이 같으면 결과가 같습니다. 검증 계층 자체는 흔들리지 않습니다.' },
    { name: 'infra', title: '멱등성 · 재현성', desc: '누가 언제 어느 환경에서 실행하든 동일 절차·동일 판정. 사람·리뷰어·실행 시점에 따른 편차가 제거됩니다.' },
    { name: 'shield', title: '실패 모드 커버리지', desc: '모델이 반복하는 오류 유형을 명시적 검사 집합으로 고정합니다. 육안 리뷰의 누락·비일관·확장 한계를 코드로 대체합니다.' },
    { name: 'eval', title: '관측 가능성 (Observability)', desc: '조용한 실패 대신 fail-loud. 어디서 어떤 가정이 깨졌는지 원인을 짚는 진단을 냅니다.' },
    { name: 'developer', title: '게이트화 (Gating)', desc: '종료 코드 같은 기계 판독 가능한 신호로 CI 파이프라인에 그대로 연결됩니다. 머지 전 결정론적 게이트에서 걸립니다.' },
  ];

  const operations = [
    { name: 'check', title: '무설치 (Zero Install)', desc: 'pip/npm install이나 빌드 단계가 없습니다. 가리키고(point) 실행합니다. 환경 차이로 인한 설치 실패 변수가 없습니다.' },
    { name: 'edu', title: '자기 문서화', desc: '각 하네스는 동봉된 얇은 스킬 문서와 1:1로 짝지어집니다. 숨은 동작이 없어 호출 표면이 그대로 노출됩니다.' },
    { name: 'eval', title: '재현 가능', desc: '동일 입력 → 동일 결과. 어제 통과한 것이 오늘 비결정적으로 깨지지 않습니다.' },
    { name: 'shield', title: '명시적 실패', desc: '예외·진단에 실패 지점과 원인 힌트를 담아, 디버깅이 추측이 아닌 추적이 되게 합니다.' },
    { name: 'infra', title: '단일 책임', desc: '한 하네스는 한 작업만 수행합니다. 직교하는 작업은 별도 하네스를 조합 — 모놀리식 확장이 아닌 작은 단위의 합성.' },
    { name: 'b2b', title: '이식성', desc: '외부 결합이 없어, 단위를 그대로 복사·반입하면 다른 환경에서도 동일하게 동작합니다.' },
  ];

  const compare = [
    ['첫인상', '배워야 쓸 수 있다', '받으면 바로 돌아간다'],
    ['추상화 두께', '다층 추상', '모델 위 얇은 한 겹'],
    ['의존성 표면', '광범위·전이 의존성', '0 (표준 라이브러리만)'],
    ['결정론', '내부 상태로 추론 어려움', '입력→출력 결정론 보장'],
    ['관측성', '블랙박스·깊은 스택트레이스', '한눈에 읽히는 단일 책임'],
    ['버전 안정성', 'API 변경에 취약', '변동원이 없음'],
    ['결합도', '생태계 락인', '무결합·이식 가능'],
    ['범위', '무엇이든 다', '한 가지를, 확실하게'],
  ];

  return (
    <div className="home-landing harness-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${harnessHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">AI 에이전트 하네스 · BANYA AGENT HARNESS</span>
          <h2>모델을 똑똑하게 만들지 않습니다<br />신뢰 가능한 구성요소로 만듭니다</h2>
          <p>
            Agent = Model + Harness. 확률적 모델의 능력은 그대로 두고, 반복적으로 이탈하는 실패 모드만
            얇고 결정론적인 실행 셸로 흡수합니다. 신뢰도는 모델 정확도가 아니라 이 셸의 커버리지에서 나옵니다.
          </p>
          <div className="hero-actions">
            <a className="cta-button" href="https://github.com/kr-ai-dev-association/harness-collection" target="_blank" rel="noopener noreferrer">GitHub에서 보기</a>
            <button className="ghost-button" onClick={() => onNavigate('agenteval')}>에이전트 평가 보기</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 정의: Agent = Model + Harness */}
        <section className="section-services">
          <h3>Agent = Model + Harness</h3>
          <div className="harness-equation">Agent&nbsp;&nbsp;=&nbsp;&nbsp;Model&nbsp;&nbsp;+&nbsp;&nbsp;Harness</div>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="developer" />
              <span className="track-badge">Model</span>
              <h4>확률적 구성요소</h4>
              <p>샘플링으로 토큰을 생성하므로 같은 입력에도 출력이 흔들리는 비결정적 요소. 능력(capability)을 담당합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <span className="track-badge">Harness</span>
              <h4>결정론적 실행 셸</h4>
              <p>모델이 아닌 모든 코드·설정·실행 로직. 모델 출력을 받아 검사·교정·라우팅하며, 능력을 끌어내는 스캐폴딩과 출력을 제약하는 가드레일을 얇게 구현합니다.</p>
            </div>
          </div>
          <blockquote className="harness-quote">
            마구(馬具)가 말의 힘을 줄이지 않고 방향만 구속하듯, 하네스도 모델의 능력은 두고 이탈 경계만 고정합니다.
          </blockquote>
        </section>

        {/* 무엇을 보장하는가 */}
        <section className="section-services">
          <h3>무엇을 보장하는가</h3>
          <p className="section-lead">모델이 줄 수 없는 비기능적 속성(non-functional properties)을 하네스가 제공합니다.</p>
          <div className="service-cards cards-row-5">
            {guarantees.map((g) => (
              <div className="service-card" key={g.title}>
                <ServiceIcon name={g.name} />
                <h4>{g.title}</h4>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
          <blockquote className="harness-quote">
            모델은 확률적으로 옳고, 하네스는 결정론적으로 안전합니다.
          </blockquote>
        </section>

        {/* 설계 가이드: Framework vs Harness */}
        <section className="section-services">
          <h3>프레임워크가 아니라 하네스</h3>
          <p className="section-lead">
            무거운 오케스트레이션 프레임워크에는 추상화 세금이 붙습니다. Banya Agent Harness는 작업 하나당
            <strong> 의존성 0·빌드 0</strong>의 자족적 실행 단위 — 트럭이 아니라 손에 딱 맞는 연장 한 자루입니다.
          </p>
          <div className="harness-compare-wrap">
            <table className="harness-compare">
              <thead>
                <tr>
                  <th>축</th>
                  <th>무거운 프레임워크</th>
                  <th>Banya Agent Harness</th>
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
          <blockquote className="harness-quote">
            하네스의 모든 구성 요소는 "모델이 혼자서는 못 한다"는 가정 하나를 인코딩합니다. 목표는 기능을 늘리는 것이 아니라, 더 덜어낼 수 없는 최소집합에 도달하는 것입니다.
          </blockquote>
        </section>

        {/* 운영 관점 특성 */}
        <section className="section-services">
          <h3>운영 관점에서의 특성</h3>
          <p className="section-lead">감사 가능하고(auditable), 신뢰하고 잊을 수 있는(trust-and-forget) 검증 단위로 수렴합니다.</p>
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
          <h3>구조가 곧 방법론</h3>
          <p className="section-lead">
            언어별 디렉터리로 분류하고, 단위는 자족적 실행체, 코드 옆에는 같은 이름의 얇은 스킬 문서를 1:1로 둡니다
            (thin docs, behavior in code). 사람이든 LLM이든 문서 한 장만 읽고 곧바로 실행합니다.
          </p>
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
          <h3>모델을 신뢰 가능한 시스템 구성요소로</h3>
          <p className="section-lead">
            한국인공지능개발자 협동조합은 온프레미스 모델 전제의 결정론적 하네스 생태계에 기여하고, 조합원과 함께 LLM 개발 도구를 발전시켜 나갑니다.
          </p>
          <button className="cta-button" onClick={() => onNavigate('signup')}>조합원으로 참여하기</button>
        </section>
      </div>
    </div>
  );
}

export default HarnessPage;
