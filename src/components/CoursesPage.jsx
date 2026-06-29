import React from 'react';
import coursesHeroBg from '../assets/social ai top.png';
import ServiceIcon from './ServiceIcon';

// 강의 — 바이브코딩대학 AX 챔피언 프로그램 소개 페이지 (다크 프리미엄 테마)
// 출처: 바이브코딩대학 AX 챔피언 프로그램 소개서 / 서비스 패키지 안내
const CONTACT = 'tonymustbegreat@gmail.com';

function CoursesPage({ onNavigate }) {
  const phases = [
    { tag: 'PHASE 01', title: '전문가의 가능성 증명', desc: '매칭 컨설턴트가 진단·PoC 구축을 수행해 검증된 결과물을 먼저 만듭니다.' },
    { tag: 'PHASE 02', title: '사내 챔피언의 AX 기능 구축', desc: '지정된 챔피언이 PoC 결과를 인수하여 컨설턴트의 교육과 함께 직접 실 기능을 만들며 역량을 흡수합니다.' },
    { tag: 'PHASE 03', title: 'DNA의 전파 · 전사 내재화', desc: '모든 직원이 AX 엔지니어가 되도록 내재화하여 AI Native 조직으로 전환합니다.' },
  ];

  const curriculum = [
    { name: 'edu', title: '현장 강의 20시간', desc: '바이브코딩의 뿌리개념부터 AI 리터러시, 소프트웨어 공학, UIUX까지 AX에 필요한 모든 개념 전반을 다룹니다.' },
    { name: 'developer', title: '현장 실습 80시간', desc: '조교 1인당 최대 5명을 배정해 모든 수강생이 강의 내용을 체화하도록 가이드합니다. 챕터별 퀘스트로 실제 동작하는 기능을 구현합니다.' },
    { name: 'eval', title: '구성원 평가 대시보드', desc: '집합 교육 진척도와 각 수강생의 산출물·성취도를 추적하는 통합 대시보드로, 조교의 정량·정성 평가를 통해 성취도를 수치화합니다.' },
  ];

  const tiers = [
    {
      tier: 'Tier 1', title: 'AX 집합교육 패키지', duration: '3개월', featured: false,
      features: ['AX 교육 100시간', '— 현장 강의 20시간', '— 현장 실습 80시간 (전담 조교 배정)', '개인 단위 미션 & 퀘스트 수행'],
    },
    {
      tier: 'Tier 2', title: 'AX 변화관리 패키지', duration: '6개월(기본) / 12개월(선택)', featured: true, badge: 'MAIN',
      features: ['AX 집합교육 패키지 전체 포함', '구성원 평가 및 현황 대시보드', 'PoC 과제 3건 선정 및 구축', '사내 챔피언 육성 및 PoC 인계', 'PoC 산출물의 PM은 사내 챔피언이 담당'],
    },
    {
      tier: 'Tier 3', title: 'AX 구축 완성 패키지', duration: '6개월(기본) / 12개월(선택)', featured: false,
      features: ['AX 변화관리 패키지 전체 포함', 'AX 구축 3건 선정 및 구축', 'PM은 조합내 AX 전문가가 담당', '사내 챔피언과 협업하며 구축'],
    },
  ];

  const steps = [
    { no: 'STEP 01', title: '진단 미팅', dur: '2~3주' },
    { no: 'STEP 02', title: '과제 선정', dur: '' },
    { no: 'STEP 03', title: 'PoC', dur: '2개월' },
    { no: 'STEP 04', title: 'AX Ops', dur: '' },
    { no: 'STEP 05', title: '챔피언 양성', dur: '6개월~' },
    { no: 'STEP 06', title: 'AX 내재화', dur: '' },
  ];

  return (
    <div className="home-landing courses-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${coursesHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">강의 · AX 챔피언 프로그램</span>
          <h2>외부에 의존하지 않는<br />AI Native 조직으로</h2>
          <p>
            핵심 과제의 요구사항만 말씀해주세요. 교육·평가·사내 챔피언 육성·PoC·구축까지 연결하는 AX 내재화 패키지로,
            그 과정에 참여한 챔피언으로부터 우리 조직의 AX를 시작합니다.
          </p>
          <div className="hero-actions">
            <a className="cta-button" href={`mailto:${CONTACT}`}>조합 B2B 견적 문의</a>
            <button className="ghost-button" onClick={() => onNavigate('signup')}>조합원 가입</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 바이브코딩대학은? */}
        <section className="section-services">
          <h3>AX 내재화를 설계하는 교육·구축 파트너</h3>
          <p className="section-lead">이론이 아닌 사내 케이스로 학습하고, 프로그램이 끝나도 조직에 역량이 남습니다.</p>
          <div className="service-cards cards-row-3">
            <div className="service-card">
              <ServiceIcon name="developer" />
              <h4>바이브코딩 기반 AX 전문</h4>
              <p>LLM · RAG · Agent 등 실무 AI 도구를 직접 다루는 역량을 조직에 이식합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>교육 × 구축의 결합</h4>
              <p>컨설팅·PoC·본 구축과 사내 챔피언 양성을 하나의 프로그램으로 연결해, 프로그램이 끝나도 역량이 남습니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2c" />
              <h4>검증된 컨설턴트 네트워크</h4>
              <p>별도 교육·평가를 통과한 전문가 집단이 진단·PoC·챔피언 양성을 직접 수행합니다.</p>
            </div>
          </div>
        </section>

        {/* 세 단계로 AI Native */}
        <section className="section-services">
          <h3>세 단계로 AI Native 기업이 됩니다</h3>
          <p className="section-lead">외주 구축으로 먼저 자리를 잡고, 그 위에 사내 챔피언을 길러 내재화한 뒤, 전사가 AX를 다루는 조직으로 탈바꿈합니다.</p>
          <div className="service-cards cards-row-3">
            {phases.map((p) => (
              <div className="service-card" key={p.tag}>
                <span className="track-badge">{p.tag}</span>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="employment-bridge">구축 <strong>→</strong> 양성 <strong>→</strong> 의존 없는 내재화</p>
        </section>

        {/* 교육 구성 */}
        <section className="section-services">
          <h3>교육 구성</h3>
          <p className="section-lead">바이브코딩 교육 → 밀착 평가(조교 : 수강생 = 1 : 5) → 숨은 X맨과 진정한 챔피언 색출.</p>
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
          <h3>3가지 패키지</h3>
          <p className="section-lead">교육, 평가, 사내 챔피언 육성, PoC, 구축까지 연결하는 AX 내재화 패키지.</p>
          <div className="course-tiers">
            {tiers.map((t) => (
              <div className={`course-tier${t.featured ? ' featured' : ''}`} key={t.tier}>
                <div className="tier-head">
                  <span className="tier-badge">{t.tier}</span>
                  {t.badge && <span className="tier-main">{t.badge}</span>}
                </div>
                <h4 className="tier-title">{t.title}</h4>
                <ul className="tier-features">
                  {t.features.map((f, i) => (
                    <li key={i} className={f.startsWith('—') ? 'tier-sub' : ''}>{f}</li>
                  ))}
                </ul>
                <div className="tier-duration">{t.duration}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 6단계 프로세스 */}
        <section className="section-services">
          <h3>진단부터 전사 내재화까지, 6단계</h3>
          <p className="section-lead">한 번의 프로젝트가 아니라, 검증된 결과물을 조직 역량으로 옮기는 연속된 흐름입니다.</p>
          <div className="course-steps">
            {steps.map((s) => (
              <div className="course-step" key={s.no}>
                <span className="step-no">{s.no}</span>
                <strong className="step-title">{s.title}</strong>
                {s.dur && <span className="step-dur">{s.dur}</span>}
              </div>
            ))}
          </div>
          <p className="employment-bridge">사내 케이스 기반 구축 + 양성 <strong>=</strong> 의존 없는 내재화 (출강 · 온라인 · 하이브리드)</p>
        </section>

        {/* CTA */}
        <section className="section-join-us">
          <h3>우리 조직의 챔피언을 찾아보세요</h3>
          <p className="section-lead">진행 방식·인원·기간에 따라 견적을 산정합니다. 회사 정보를 보내주시면 담당자가 검토 후 빠르게 회신드립니다.</p>
          <a className="cta-button" href={`mailto:${CONTACT}`}>조합 B2B 견적 문의</a>
        </section>
      </div>
    </div>
  );
}

export default CoursesPage;
