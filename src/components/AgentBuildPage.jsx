import React from 'react';
import buildHeroBg from '../assets/ict outsource.png';
import ServiceIcon from './ServiceIcon';

// 에이전트 구축 — 취업 매칭 플랫폼을 통한 직접 프로젝트 의뢰 안내 페이지 (다크 프리미엄 테마)
// 메시지: 검증된 조합원과의 매칭으로 AI 에이전트 구축 프로젝트를 성공적으로 수행
function AgentBuildPage({ onNavigate, isLoggedIn }) {
  // 검증된 조합원과 매칭되는 이유
  const values = [
    { name: 'check', title: '검증된 실력', desc: '단순 자기소개가 아니라 조합 내 실제 활동 기록과 동료 평가로 검증된 조합원만 매칭됩니다.' },
    { name: 'shield', title: '투명한 신뢰', desc: '평가는 조합 내 투표 시스템을 통해 조합원들의 투표로 이루어져, 한 사람의 주관이 아닌 집단 검증으로 신뢰를 담보합니다.' },
    { name: 'developer', title: '직접 의뢰', desc: '중개 단계 없이 취업 매칭 플랫폼에서 프로젝트를 직접 등록하고, 적합한 조합원과 곧바로 연결됩니다.' },
    { name: 'eval', title: '성공적 수행', desc: 'AI 에이전트 설계·구축 경험을 갖춘 조합원과의 매칭으로 요구사항에 맞는 결과물까지 안정적으로 도달합니다.' },
  ];

  // 조합원 검증 파이프라인 (활동 → 평가 → 투표 → 검증)
  const verifyPipeline = [
    { name: 'developer', title: '조합 내 활동', desc: '커뮤니티 기여, 프로젝트 수행, 강의·평가 참여 등 실제 활동이 기록됩니다.' },
    { name: 'eval', title: '활동에 대한 평가', desc: '서비스 제공 조합원의 검증은 이 활동 기록에 대한 평가를 기반으로 합니다.' },
    { name: 'check', title: '조합원 투표', desc: '평가는 조합 내 투표 시스템을 통해 조합원들의 투표로 결정됩니다.' },
    { name: 'shield', title: '검증 완료', desc: '투표를 통과한 조합원만이 의뢰 프로젝트의 매칭 대상이 됩니다.' },
  ];

  return (
    <div className="home-landing agentbuild-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${buildHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">AI 에이전트 구축 · 취업 매칭 플랫폼</span>
          <h2>프로젝트를 직접 의뢰하고<br />검증된 조합원과 성공적으로 완성하세요</h2>
          <p>
            한국인공지능개발자 협동조합의 취업 매칭 플랫폼에서는 AI 에이전트 구축 프로젝트를 직접 의뢰할 수 있습니다.
            조합 내 활동 평가로 검증된 조합원들과의 매칭을 통해, 의뢰부터 완성까지 안심하고 진행하실 수 있습니다.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate('employment')}>지금 프로젝트 의뢰하기</button>
            <button className="ghost-button" onClick={() => onNavigate('signup')}>조합원 가입</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 왜 검증된 조합원과 매칭되는가 */}
        <section className="section-services">
          <h3>검증된 조합원과의 매칭</h3>
          <p className="section-lead">
            누구에게나 맡기는 외주가 아닙니다. 조합 안에서 실력과 신뢰가 검증된 조합원과 직접 연결되어, 프로젝트의 성공 가능성을 높입니다.
          </p>
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
          <h3>조합원 검증은 이렇게 이루어집니다</h3>
          <p className="section-lead">
            서비스를 제공하는 조합원의 검증은 <strong>조합 내 활동에 대한 평가</strong>로 이루어지며,
            그 평가는 <strong>조합 내 투표 시스템을 사용한 조합원들의 투표</strong>로 결정됩니다.
          </p>
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
              <span className="vote-badge">조합 내 투표 시스템</span>
              <h4>조합원 다수의 투표로 검증합니다</h4>
              <p>
                한 사람의 평판이 아니라, 정회원 조합원들이 <strong>1인 1표</strong>로 참여한 투표 결과가
                곧 서비스 제공 자격의 검증이 됩니다.
              </p>
            </div>
            <div className="vote-panel-viz">
              {/* 안건 + 찬반 집계 */}
              <div className="vote-ballot">
                <div className="vb-head">
                  <span className="vb-name">김○○ 조합원</span>
                  <span className="vb-tag">서비스 제공 자격 심사</span>
                </div>
                <div className="vb-bar">
                  <span className="vb-bar-label">찬성</span>
                  <span className="vb-track"><span className="vb-fill approve" style={{ width: '82%' }} /></span>
                  <span className="vb-pct">82%</span>
                </div>
                <div className="vb-bar">
                  <span className="vb-bar-label">반대</span>
                  <span className="vb-track"><span className="vb-fill reject" style={{ width: '18%' }} /></span>
                  <span className="vb-pct">18%</span>
                </div>
                <div className="vb-meta">총 64표 · 정족수 충족 · 가결</div>
              </div>
              {/* 승인 도넛 */}
              <div className="vote-ring" role="img" aria-label="찬성 82%로 검증 통과">
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
                  <span>검증 통과</span>
                </div>
              </div>
            </div>
          </div>

          <blockquote className="harness-quote">
            한 사람의 평판이 아니라 조합원 다수의 투표로 검증합니다. 의뢰하신 프로젝트는 집단이 인정한 실력에 맡겨집니다.
          </blockquote>
        </section>

        {/* 조합 내 투표 시스템 소개 */}
        <section className="section-services">
          <h3>조합 내 투표 시스템</h3>
          <p className="section-lead">
            협동조합의 의사결정과 조합원 검증은 모두 투표 시스템 위에서 투명하게 이루어집니다.
          </p>
          <div className="service-cards cards-row-3">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>1인 1표의 평등</h4>
              <p>정회원 조합원은 누구나 동등한 한 표를 행사합니다. 검증과 의사결정의 권한이 소수에 집중되지 않습니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>활동 기반 평가 투표</h4>
              <p>조합원의 활동 기여를 안건으로 올려 평가 투표를 진행합니다. 결과가 곧 서비스 제공 자격의 검증이 됩니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>기록으로 남는 투명성</h4>
              <p>모든 투표는 시스템에 기록되어 누가·언제·어떻게 검증되었는지 추적할 수 있습니다.</p>
            </div>
          </div>
          <p className="section-lead section-note">
            투표 메뉴는 정회원 조합원에게 공개됩니다. 검증에 직접 참여하려면 조합원으로 가입하세요.
          </p>
        </section>

        {/* 취업 메뉴에서 프로젝트 만드는 방법 — 단계별 가이드 + 스크린샷 */}
        <section className="section-services">
          <h3>프로젝트 의뢰, 이렇게 등록하세요</h3>
          <p className="section-lead">
            <strong>취업</strong> 메뉴에서 프로젝트 구인 또는 외주 프로젝트를 직접 만들 수 있습니다. 단계별로 따라 해 보세요.
          </p>

          {/* 흐름 요약 스트립 */}
          <div className="flow-strip" aria-hidden="true">
            {['로그인', '취업 이동', '+ 공고 등록', '구분 선택', '내용 작성', '등록·매칭'].map((label, i) => (
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
                <h4>조합원으로 로그인</h4>
                <p>프로젝트 등록은 조합원만 이용할 수 있습니다. 상단 우측에서 로그인하세요. 아직 조합원이 아니라면 먼저 가입이 필요합니다.</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 홈</span></div>
                <div className="shot-body shot-topbar">
                  <span className="shot-logo">한국인공지능개발자 협동조합</span>
                  <span className="shot-spacer" />
                  <span className="shot-btn">로그인</span>
                  <span className="shot-btn primary">회원가입</span>
                </div>
              </div>
            </li>

            {/* STEP 2 */}
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 2</span>
                <h4>상단 메뉴에서 &lsquo;취업&rsquo; 이동</h4>
                <p>네비게이션의 <strong>취업</strong> 메뉴를 클릭해 취업 매칭 플랫폼으로 이동합니다.</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 홈</span></div>
                <div className="shot-body shot-nav">
                  <span className="shot-nav-item">조합소개</span>
                  <span className="shot-nav-item">사업·서비스 ▾</span>
                  <span className="shot-nav-item">에이전트 하네스</span>
                  <span className="shot-nav-item active">취업</span>
                  <span className="shot-nav-item">커뮤니티</span>
                </div>
              </div>
            </li>

            {/* STEP 3 */}
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 3</span>
                <h4>&lsquo;+ 공고 등록&rsquo; 클릭</h4>
                <p>취업 페이지 우측 상단의 <strong>+ 공고 등록</strong> 버튼을 눌러 새 등록 화면을 엽니다.</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 취업</span></div>
                <div className="shot-body">
                  <div className="shot-tabs">
                    <span className="shot-tab active">전체</span>
                    <span className="shot-tab">채용공고</span>
                    <span className="shot-tab">프로젝트 구인</span>
                    <span className="shot-tab">외주 프로젝트</span>
                    <span className="shot-spacer" />
                    <span className="shot-btn primary glow">+ 공고 등록</span>
                  </div>
                  <div className="shot-card">
                    <span className="shot-card-badge cyan">외주 프로젝트</span>
                    <span className="shot-card-title">AI 상담 에이전트 구축</span>
                    <span className="shot-card-meta">예산 3,000만원 · 3개월 · 원격</span>
                  </div>
                  <div className="shot-card">
                    <span className="shot-card-badge indigo">프로젝트 구인</span>
                    <span className="shot-card-title">RAG 파이프라인 백엔드 개발</span>
                    <span className="shot-card-meta">Python · LangChain · 2명 모집</span>
                  </div>
                </div>
              </div>
            </li>

            {/* STEP 4 */}
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 4</span>
                <h4>구분 선택: 프로젝트 구인 / 외주 프로젝트</h4>
                <p>
                  팀을 꾸려 함께 만들 인원을 모집한다면 <strong>프로젝트 구인</strong>, 작업 전체를 맡길 의뢰라면 <strong>외주 프로젝트</strong>를 선택하세요.
                  외주 프로젝트는 조합원 누구나, 프로젝트 구인·채용공고는 승인된 법인 회원이 등록할 수 있습니다.
                </p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 공고 등록</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-label">구분</span>
                  <div className="shot-dropdown">
                    <span className="shot-select open">외주 프로젝트 ▴</span>
                    <ul className="shot-options">
                      <li>채용공고 <em>법인 회원</em></li>
                      <li>프로젝트 구인 <em>법인 회원</em></li>
                      <li className="active">외주 프로젝트 <em>조합원</em> ✓</li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            {/* STEP 5 */}
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 5</span>
                <h4>프로젝트 내용 작성</h4>
                <p>
                  제목과 상세 설명을 입력하고, 예산·기간·진행 형태와 함께 <strong>기능 요구사항</strong>·<strong>스크린샷</strong>을 첨부하면
                  조합원이 범위를 정확히 파악할 수 있습니다. 마지막으로 연락처(이메일/전화)를 남기세요.
                </p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 공고 등록</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-label">제목 *</span>
                  <span className="shot-input">AI 상담 에이전트 구축</span>
                  <span className="shot-label">프로젝트/상세 설명 *</span>
                  <span className="shot-input tall">요구사항을 입력하세요…</span>
                  <div className="shot-grid2">
                    <div><span className="shot-label">예산 *</span><span className="shot-input">3,000만원</span></div>
                    <div><span className="shot-label">기간</span><span className="shot-input">3개월</span></div>
                  </div>
                  <span className="shot-label">스크린샷 / 기능 요구사항</span>
                  <span className="shot-upload">＋ 이미지 첨부</span>
                </div>
              </div>
            </li>

            {/* STEP 6 */}
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 6</span>
                <h4>등록하고 매칭 받기</h4>
                <p>
                  <strong>등록</strong>을 누르면 공고가 게시됩니다. 검증된 조합원이 지원·문의하면 메시지로 연결되어 프로젝트를 시작할 수 있습니다.
                </p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 공고 등록</span></div>
                <div className="shot-body">
                  <div className="shot-toast">✓ 공고가 등록되었습니다</div>
                  <div className="shot-submit">
                    <span className="shot-btn ghost">취소</span>
                    <span className="shot-btn primary">등록</span>
                  </div>
                  <div className="shot-match">
                    <span className="shot-avatar" />
                    <span className="shot-match-text"><strong>검증된 조합원</strong>이 지원했습니다 · 메시지 도착</span>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* CTA — 조합원 가입 안내 */}
        <section className="section-join-us">
          <h3>먼저 조합원으로 가입하세요</h3>
          <p className="section-lead">
            프로젝트 의뢰와 검증된 조합원 매칭, 조합 내 투표 시스템 참여는 모두 조합원에게 열려 있습니다.
            지금 가입하고 AI 에이전트 구축 프로젝트를 시작하세요.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate('signup')}>조합원으로 가입하기</button>
            {isLoggedIn && (
              <button className="ghost-button" onClick={() => onNavigate('employment')}>취업 매칭 바로가기</button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AgentBuildPage;
