import React from 'react';
import './MediationPage.css';
import disputeHeroBg from '../assets/lawyer.png';
import ServiceIcon from './ServiceIcon';

// 분쟁 조정 소개 — 외주 프로젝트 분쟁 + 노동·계약 분쟁 조정 안내 (AgentBuildPage 와 동일 스타일)
function DisputeServicePage({ onNavigate, isLoggedIn }) {
  // 조합이 함께 해결하는 분쟁 영역
  const domains = [
    { name: 'jobseeker', title: '노동 분쟁', desc: '임금 체불·미지급, 부당해고, 노동 환경·처우, 산업재해 등 노동 현장에서 발생하는 분쟁을 조합이 함께 대응합니다.' },
    { name: 'developer', title: '프리랜서·도급 분쟁', desc: '불법 파견, 위장도급(다단계 비정규직) 등 실제 업무는 정규직과 같으나 비정규직·프리랜서로 계약된 부당한 구조를 바로잡습니다.' },
    { name: 'infra', title: '자영업·계약 분쟁', desc: '기업·대기업과의 불공정 계약, 기술 탈취, 지식재산권 분쟁으로부터 조합원의 권익을 지킵니다.' },
    { name: 'check', title: '외주 프로젝트 분쟁', desc: '플랫폼에서 체결된 외주 계약의 결과물·정산 분쟁을 평가팀의 소스 구동 E2E 검증과 함께 조정합니다.' },
  ];

  // 분쟁 조정 절차
  const pipeline = [
    { name: 'developer', title: '의뢰 접수', desc: '조합원이 분쟁 조정 의뢰 페이지에서 유형·상세 내용·증빙을 작성해 신청합니다. (1,000 coin)' },
    { name: 'eval', title: '검토 배정', desc: '조합 분쟁조정위원회가 사안을 검토하고 변호사·변리사·전문가를 배정합니다.' },
    { name: 'shield', title: '단계별 조정', desc: '배정된 전문가가 단계별로 조정을 진행하며, 각 단계가 의뢰자에게 알림·이메일로 전달됩니다.' },
    { name: 'check', title: '해결·종결', desc: '합의안 도출·정산·권리 회복까지 조합이 끝까지 함께합니다.' },
  ];

  // 위장도급(다단계 비정규직) 설명 포인트
  const disguised = [
    '실제 물리적 현장에 상시 출근(9시~6시)',
    '명확하고 구체적인 업무 지시',
    '매일·주간 단위의 업무 보고·확인',
    '업무 내용은 정규직과 동일',
  ];

  return (
    <div className="home-landing agentbuild-page">
      {/* 히어로 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${disputeHeroBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">분쟁 조정 · 법률 지원 서비스</span>
          <h2>혼자 싸우지 마세요<br />조합이 변호사·변리사와 함께합니다</h2>
          <p>
            AI가 확산되며 노동 현장과 계약 관계는 더 복잡해지고 있습니다. 한국인공지능개발자 협동조합은
            노동자·프리랜서·자영업자가 기업과 겪는 임금·해고·불법파견·불공정계약·기술탈취·지식재산권 분쟁을
            <strong> 변호사·변리사·전문가를 배정해 단계별로 조정</strong>합니다.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate(isLoggedIn ? 'mediation' : 'signup')}>분쟁 조정 의뢰하기</button>
            <button className="ghost-button" onClick={() => onNavigate('signup')}>조합원 가입</button>
          </div>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 조합이 함께 해결하는 분쟁 */}
        <section className="section-services">
          <h3>조합이 함께 해결합니다</h3>
          <p className="section-lead">
            개인이 기업을 상대로 홀로 분쟁을 감당하기는 어렵습니다. 조합은 조합원의 편에서 전문가를 배정해 분쟁 해결을 지원합니다.
          </p>
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
          <h3>다루는 분쟁 유형</h3>
          <p className="section-lead">노동·프리랜서·자영업 현장에서 발생하는 다양한 분쟁을 폭넓게 다룹니다.</p>
          <div className="med-cat-grid">
            {['임금 체불·미지급', '부당 해고', '노동 환경·처우', '산업재해', '불법 파견', '위장도급(다단계 비정규직)', '불공정 계약', '기술 탈취', '지식재산권 분쟁'].map((c) => (
              <span className="med-cat-tile" key={c}>{c}</span>
            ))}
          </div>

          {/* 위장도급 강조 패널 */}
          <div className="vote-panel">
            <div className="vote-panel-head">
              <span className="vote-badge">집중 조명</span>
              <h4>위장도급 · 다단계 비정규직</h4>
              <p>
                실제 업무는 정규직과 똑같은데, 중간 인력 파견 업체를 끼워 비정규직·프리랜서로 계약하게 하는 구조입니다.
                아래에 해당한다면 <strong>위장도급</strong>일 수 있으며, 조합이 법적 검토를 지원합니다.
              </p>
            </div>
            <ul className="med-disguised-list">
              {disguised.map((p) => <li key={p}><span className="md-check">✓</span>{p}</li>)}
            </ul>
          </div>
        </section>

        {/* 조정 절차 파이프라인 */}
        <section className="section-services">
          <h3>분쟁 조정은 이렇게 진행됩니다</h3>
          <p className="section-lead">
            접수부터 해결까지, 모든 단계가 의뢰자에게 <strong>알림과 이메일</strong>로 투명하게 전달됩니다.
          </p>
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
          <blockquote className="harness-quote">
            조합은 IT·인공지능 전문가와 변호사·변리사로 구성된 조정단을 파견해, 공고·계약·기능 요구사항 등 사실에 근거하여 분쟁을 조정합니다.
          </blockquote>
        </section>

        {/* 두 갈래의 분쟁 조정 */}
        <section className="section-services">
          <h3>두 갈래의 분쟁 조정</h3>
          <p className="section-lead">조합의 분쟁 조정은 대상에 따라 두 경로로 운영됩니다.</p>
          <div className="service-cards cards-row-2">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>외주 프로젝트 분쟁</h4>
              <p>
                플랫폼에서 체결된 외주 계약(의뢰자↔수행자)의 결과물·정산 분쟁입니다. 마감(계약 체결)된 외주 상세에서
                <strong> 분쟁 해결 요청</strong> 버튼으로 신청하며, 평가팀의 소스 구동 E2E 검증과 함께 조정합니다.
              </p>
              <button className="ghost-button small" onClick={() => onNavigate('employment')}>취업 매칭으로 이동</button>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>노동·계약 분쟁</h4>
              <p>
                노동자·프리랜서·자영업자가 기업과 겪는 임금·해고·불법파견·불공정계약·기술탈취·지식재산권 분쟁입니다.
                <strong> 분쟁 조정 의뢰</strong> 페이지에서 신청하면 변호사·변리사·전문가가 배정됩니다.
              </p>
              <button className="cta-button small" onClick={() => onNavigate(isLoggedIn ? 'mediation' : 'signup')}>분쟁 조정 의뢰</button>
            </div>
          </div>
        </section>

        {/* 의뢰 방법 가이드 */}
        <section className="section-services">
          <h3>이렇게 의뢰하세요</h3>
          <p className="section-lead">프로필 메뉴의 <strong>분쟁 조정 의뢰</strong>에서 몇 단계만 거치면 됩니다.</p>
          <div className="flow-strip" aria-hidden="true">
            {['로그인', '분쟁 조정 의뢰', '유형·내용 작성', '1,000 coin 차감', '접수', '단계별 알림'].map((label, i) => (
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
                <h4>프로필 메뉴 → 분쟁 조정 의뢰</h4>
                <p>로그인 후 우측 상단 프로필 메뉴에서 <strong>분쟁 조정 의뢰</strong>를 엽니다.</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 프로필</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-input">내정보</span>
                  <span className="shot-input active">분쟁 조정 의뢰</span>
                  <span className="shot-input">내 지원 관리</span>
                  <span className="shot-input">내 공고 관리</span>
                </div>
              </div>
            </li>
            <li className="guide-step reverse">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 2</span>
                <h4>유형 선택 · 상세 내용 작성</h4>
                <p>의뢰자 구분(노동자/프리랜서/자영업자)과 분쟁 유형을 고르고, 발생 경위·계약 형태·피해 내용과 증빙 링크를 작성합니다.</p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 분쟁 조정 의뢰</span></div>
                <div className="shot-body shot-form">
                  <span className="shot-label">의뢰자 구분</span>
                  <div className="shot-tabs"><span className="shot-tab active">노동자</span><span className="shot-tab">프리랜서</span><span className="shot-tab">자영업자</span></div>
                  <span className="shot-label">분쟁 유형</span>
                  <span className="shot-input">위장도급(다단계 비정규직)</span>
                  <span className="shot-label">분쟁 상세 내용 *</span>
                  <span className="shot-input tall">발생 경위를 작성하세요…</span>
                </div>
              </div>
            </li>
            <li className="guide-step">
              <div className="guide-step-text">
                <span className="guide-step-num">STEP 3</span>
                <h4>의뢰 접수 · 단계별 조정</h4>
                <p>
                  <strong>1,000 coin</strong> 차감 후 접수되면, 조합이 변호사·변리사·전문가를 배정해 단계별로 조정합니다.
                  진행 상황은 <strong>나의 조정 현황</strong>과 알림·이메일로 확인할 수 있습니다.
                </p>
              </div>
              <div className="guide-shot">
                <div className="shot-bar"><span></span><span></span><span></span><span className="shot-addr">app · 나의 조정 현황</span></div>
                <div className="shot-body">
                  <div className="shot-toast">✓ 분쟁 조정 의뢰가 접수되었습니다</div>
                  <div className="shot-card"><span className="shot-card-badge cyan">전문가 배정</span><span className="shot-card-title">위장도급 정규직 전환 요구</span><span className="shot-card-meta">변호사 김○○ · 변리사 이○○ 배정</span></div>
                  <div className="shot-match"><span className="shot-avatar" /><span className="shot-match-text"><strong>조정 진행</strong> 단계 알림이 도착했습니다</span></div>
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* CTA */}
        <section className="section-join-us">
          <h3>권리는 혼자 지키는 것이 아닙니다</h3>
          <p className="section-lead">
            조합원이라면 누구나 분쟁 조정을 의뢰할 수 있습니다. 변호사·변리사·전문가가 함께하는 조정으로 정당한 권리를 되찾으세요.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => onNavigate(isLoggedIn ? 'mediation' : 'signup')}>{isLoggedIn ? '분쟁 조정 의뢰하기' : '조합원으로 가입하기'}</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DisputeServicePage;
