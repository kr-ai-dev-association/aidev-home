import React, { useEffect } from 'react'; // useEffect 임포트
import socialAiTop from '../assets/social ai top.png'; // 히어로 배경 이미지
import ServiceIcon from './ServiceIcon'; // 통일 라인 아이콘
import '../App.css'; // 공통 스타일을 위해 App.css 임포트

function AboutPage({ scrollToSectionId, onScrollComplete }) { // scrollToSectionId, onScrollComplete prop 추가
  // scrollToSectionId prop이 변경될 때 해당 섹션으로 스크롤하는 useEffect
  useEffect(() => {
    if (scrollToSectionId) {
      const element = document.getElementById(scrollToSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (onScrollComplete) {
          onScrollComplete();
        }
      }
    }
  }, [scrollToSectionId, onScrollComplete]);

  return (
    <div className="home-landing about-landing">
      {/* 히어로 */}
      <section className="hero-banner" id="about-intro-section" style={{ backgroundImage: `url(${socialAiTop})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-grid" aria-hidden="true"></div>
        <div className="banner-content">
          <span className="hero-eyebrow">ABOUT · 조합 소개</span>
          <h2>한국인공지능개발자<br />협동조합</h2>
          <p>대한민국 AI 생태계의 미래를 선도하는 개발자 중심 플랫폼. 출자금과 무관하게 모든 조합원이 1인 1표를 행사하는 민주적 협동조합입니다.</p>
        </div>
      </section>

      <div className="home-page-container content-area-container">
        {/* 설립 개요 */}
        <section className="section-services" id="about-overview-section">
          <h3>설립 개요</h3>
          <div className="about-mission">
            <p>
              대한민국 AI 기술 발전과 <strong>바이브코딩 생태계 확산</strong>을 주도하고, 현업 개발자의 권익 보호를 도모하며,
              독자적인 AI 인프라 플랫폼을 기반으로 <strong>고부가가치 B2B 솔루션</strong> 및 산학연 협력 모델을 창출합니다.
            </p>
          </div>
          <h4 className="about-subhead">조합원 자격</h4>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="b2c" />
              <span className="track-badge">소비자 / 직원 조합원</span>
              <h4>개인 개발자</h4>
              <p>IT 프리랜서, AI 개발자, 대학생 및 예비 창업자 — 성장과 권익 보호를 함께 누립니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <span className="track-badge">사업자 조합원</span>
              <h4>기업 · 기관</h4>
              <p>자체 클라우드/서버 인프라 제공 법인, AI 도입 희망 기업, 대학교가 참여합니다.</p>
            </div>
          </div>
        </section>

        {/* 지배구조 */}
        <section className="section-services" id="about-governance-section">
          <h3>지배구조 (Governance)</h3>
          <p className="section-lead">투명성과 민주성을 정관으로 보장합니다.</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="check" />
              <h4>1인 1표 의결권</h4>
              <p>출자금 규모와 무관하게 모든 조합원이 동등하게 1표를 행사하는 완전한 민주적 의사결정 구조입니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="shield" />
              <h4>겸직 금지 조항</h4>
              <p>이사장은 총회 투표로 선출되며, "타 영리 법인의 대표권 임원을 겸직할 수 없다"는 강력한 이해상충 방지 조항을 명시합니다.</p>
            </div>
          </div>
        </section>

        {/* 전략적 파트너십 */}
        <section className="section-services" id="about-partnership-section">
          <h3>전략적 파트너십 (인프라 법인 합류)</h3>
          <p className="section-lead">대규모 클라우드·서버 인프라 문제를 해결하기 위해, 인프라 보유 법인이 초기 발기인으로 합류합니다.</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <h4>현금 출자 가입</h4>
              <p>복잡한 현물출자가 아닌, 일반 발기인과 동일한 '현금 출자(표준 출자금 납입)' 방식으로 사업자 조합원으로 정식 가입합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>인프라 무상 공급 MOU</h4>
              <p>플랫폼 운영 자원을 무상 또는 파격 할인가로 독점 제공하는 공식 계약을 체결해 초기 R&D·마케팅 자금을 세이브합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>이용 실적 기반 배당</h4>
              <p>B2B 프로젝트·플랫폼 매출 발생 시 '이용 실적에 따른 배당'으로 인프라 법인에 우선 지급하는 윈윈 구조를 확립합니다.</p>
            </div>
          </div>
        </section>

        {/* 수익화 및 배당 원칙 */}
        <section className="section-services" id="about-monetization-section">
          <h3>수익화 및 배당 원칙</h3>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>SaaS 기반 수익</h4>
              <p>프리미엄 멤버십(추가 GPU 할당, 무제한 강의 수강권)과 맞춤형 모델 추출(Export) 라이선스로 수익을 창출합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>B2B 프로젝트 수주</h4>
              <p>LLM·에이전트 성능 공인 평가 리포트 발급 수수료, 맞춤형 sLLM 구축 및 DX 컨설팅 용역으로 수익을 확보합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="academia" />
              <h4>B2Academia 수익</h4>
              <p>대학 산학협력 정규 커리큘럼 사용료 및 강사 파견비로 안정적인 라이선스 수익을 만듭니다.</p>
            </div>
          </div>
          <div className="about-dividend">
            <h4 className="about-subhead">합리적인 배당(보상) 원칙</h4>
            <ul>
              <li><strong>프로젝트 직접 보상:</strong> B2B 프로젝트·대학 출강에 직접 투입된 조합원에게 용역비·강사료를 즉각 지급.</li>
              <li><strong>기여도·이용 실적 배당:</strong> 오픈소스 기여, 플랫폼 활동량, 인프라 제공 실적에 비례해 연말 잉여금 배당.</li>
              <li><strong>강사 인센티브:</strong> VOD 순수익 70% 정산, 오프라인·B2B 특강 강사료 80% 이상 즉시 지급, 우수 크리에이터 특별 배당.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
