import React, { useEffect } from 'react'; // useEffect 임포트
import socialAiTop from '../assets/social ai top.png'; // New import: social ai top.png 이미지 임포트
import aiDevChallengeBg from '../assets/ai dev challenge.png'; // New import: ai dev challenge.png 이미지 임포트
import '../App.css'; // 공통 스타일을 위해 App.css 임포트

function AboutPage({ scrollToSectionId, onScrollComplete }) { // scrollToSectionId, onScrollComplete prop 추가
  // scrollToSectionId prop이 변경될 때 해당 섹션으로 스크롤하는 useEffect
  useEffect(() => {
    if (scrollToSectionId) {
      const element = document.getElementById(scrollToSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // 스크롤이 완료되면 부모 컴포넌트에 알림
        if (onScrollComplete) {
          onScrollComplete();
        }
      }
    }
  }, [scrollToSectionId, onScrollComplete]); // 의존성 배열에 onScrollComplete 추가

  return (
    <> {/* React Fragment를 사용하여 여러 최상위 요소를 반환 */}
      {/* 협회 소개 배너 - social ai top.png 이미지 사용 */}
      <section className="about-page-banner" id="about-intro-section" style={{ backgroundImage: `url(${socialAiTop})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>AIDEV는 누구인가?</h2>
          <p>한국 인공지능 개발자 협회(AIDEV)는 AI 개발자들의 성장과 권리 보호를 위한 한국 대표 협회입니다.</p>
        </div>
      </section>

      {/* 첫 번째 콘텐츠 컨테이너 */}
      <div className="about-page-container content-area-container">
        <br />
        <strong>대한민국 AI 개발자 및 산업은 다음과 같은 복합적인 문제에 직면해 있습니다.</strong>
        <section className="section-about-problems">
          <ul>
            <li><strong>개발자 권익 보호의 사각지대:</strong> 기존의 노동법 체계는 프리랜서, 계약직, 스타트업 소속이 많은 AI 개발자들의 다양한 고용 형태를 포괄하지 못하고 있습니다. 이로 인해 불공정한 계약, 부당한 처우, 임금 체불 등의 문제에 효과적으로 대응하기 어렵습니다.</li>
            <li><strong>만연한 불공정 계약 및 법적 분쟁:</strong> SW 산업의 고질적인 다단계 하도급 구조는 개발자들에게 부당한 계약 조건과 책임을 전가하는 문제를 낳고 있습니다. 특히 무형의 결과물을 다루는 SW 개발의 특성상 요구사항 변경, 품질 검수, 하자 보수 과정에서 법적 분쟁이 끊이지 않으며, 개인이나 소규모 기업은 비용 부담으로 인해 적절한 법적 대응을 포기하는 경우가 많습니다.</li>
            <li><strong>사회적, 경제적 위상의 저평가:</strong> 높은 전문성에도 불구하고 국내 AI 개발자를 포함한 IT 업계 종사자들은 타 전문직에 비해 사회적, 경제적 지위가 낮게 평가받고 있습니다. 이는 우수 인력의 해외 유출과 국내 AI 기술 경쟁력 저하의 원인이 됩니다.</li>
            <li><strong>산업 수요와 인력 공급의 미스매치:</strong> 기업들은 고급 AI 인력 수급에 어려움을 겪는 반면, 개발자들은 자신의 가치를 제대로 인정받고 성장할 수 있는 기회를 찾기 힘든 실정입니다.</li>
            <li><strong>AI 윤리 및 안전 규제 부재:</strong> AI 기술의 영향력이 커지면서 데이터 편향성, 알고리즘의 투명성, 책임 소재 등 윤리적 문제가 중요해지고 있으나, 이를 감시하고 감독할 실질적인 민간 주도 기구가 부재합니다.</li>
          </ul>
        </section>
      </div> {/* 첫 번째 about-page-container 종료 */}

      {/* 새로운 중간 배너 섹션 (ai dev challenge.png 이미지 사용) */}
      <section className="challenge-banner" style={{ backgroundImage: `url(${aiDevChallengeBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <p>이제 더이상 혼자 고민하지 마세요. 한국 인공지능 개발자 협회가 함께 합니다.</p>
        </div>
      </section>

      {/* 두 번째 콘텐츠 컨테이너 */}
      <div className="about-page-container content-area-container">
        <section className="section-about-solutions">
          <ul>
            <li><strong>권익 보호 및 법률 지원:</strong> 협회 내 전문 법무팀을 통해 불공정 계약 검토, 법률 상담, 분쟁 조정 및 소송 지원 등 무료 법무 서비스를 제공하여 개발자들이 안정적인 환경에서 업무에 집중할 수 있도록 돕습니다.</li>
            <li><strong>소통 창구 및 정책 제안:</strong> 개발자들의 의견을 수렴하여 정부 및 관련 기관에 전달하고, 현실적인 정책 대안을 제시하여 AI 산업의 제도적 기반을 강화합니다.</li>
            <li><strong>합리적 시장 환경 조성:</strong> 헤드헌팅 및 사업 중계 플랫폼을 통해 개발자들이 정당한 대우를 받고, 기업은 우수한 인재를 확보할 수 있는 투명한 시장 환경을 만듭니다.</li>
            <li><strong>기술 및 윤리 표준 제시:</strong> 최신 기술 교육과 세미나를 통해 개발자들의 역량 강화를 지원하고, AI 윤리 가이드라인 및 검증 소프트웨어를 개발·보급하여 신뢰할 수 있는 AI 기술의 사회적 확산을 주도합니다.</li>
          </ul>
        </section>
      </div> {/* 두 번째 about-page-container 종료 */}
    </>
  );
}

export default AboutPage;