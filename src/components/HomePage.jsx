import React from 'react';
// assets 폴더의 이미지들을 임포트합니다. 실제 파일명과 경로에 맞게 수정해주세요.
import heroBannerBg from '../assets/hero-banner-bg.jpg';
import iconLegal from '../assets/icon-legal.png';
import iconCareer from '../assets/icon-career.png';
import iconTech from '../assets/icon-tech.png';
import iconEthics from '../assets/icon-ethics.png';
import aiDevChallengeBg from '../assets/ai dev challenge.png'; // 새로운 배경 이미지 임포트

function HomePage({ onSignupClick }) {
  return (
    <> {/* React Fragment를 사용하여 여러 최상위 요소를 반환 */}
      {/* 상단 배너/슬라이더 - 이제 home-page-container 밖으로 이동하여 전체 너비를 차지 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${heroBannerBg})` }}>
        <div className="banner-overlay"></div> {/* 배경 이미지 위에 텍스트 가독성을 위한 오버레이 추가 */}
        <div className="banner-content">
          <h2>AI 개발자의 권익 보호와 산업의 미래를 열다</h2>
          <p>AIDEV는 AI 개발자들의 성장과 권리 보호를 위한 한국 대표 협회입니다.</p>
          <button className="cta-button" onClick={onSignupClick}>지금 가입하기</button>
        </div>
      </section>

      {/* 협회 소개 요약 및 핵심 서비스는 첫 번째 home-page-container 안에 유지 */}
      <div className="home-page-container">
        {/* 협회 소개 요약 */}
        <section className="section-intro">
          <h3>AIDEV는 누구인가?</h3>
          <p>한국 인공지능 개발자 협회(AIDEV)는 AI 개발자들의 전문성 강화와 공정한 생태계 조성을 위해 다양한 활동을 펼치고 있습니다. 우리는 법률 지원, 사업/경력 기회 제공, 기술 역량 강화, AI 윤리 및 신뢰 구축을 통해 AI 산업 발전에 기여합니다.</p>
          <button className="detail-button" onClick={() => console.log('협회 소개 페이지로 이동')}>자세히 보기</button>
        </section>

        {/* 핵심 서비스 소개 */}
        <section className="section-services">
          <h3>핵심 서비스</h3>
          <div className="service-cards">
            <div className="service-card">
              <img src={iconLegal} alt="법률 지원 아이콘" className="service-icon" />
              <h4>법률 지원</h4>
              <p>"불공정한 계약, 법적 분쟁 걱정 끝!"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
            <div className="service-card">
              <img src={iconCareer} alt="사업/경력 기회 아이콘" className="service-icon" />
              <h4>사업/경력 기회</h4>
              <p>"투명한 프로젝트 중개, 역경매 플랫폼"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
            <div className="service-card">
              <img src={iconTech} alt="기술 역량 강화 아이콘" className="service-icon" />
              <h4>기술 역량 강화</h4>
              <p>"최신 기술 교육, 개발 인프라 지원"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
            <div className="service-card">
              <img src={iconEthics} alt="AI 윤리 및 신뢰 아이콘" className="service-icon" />
              <h4>AI 윤리 및 신뢰</h4>
              <p>"AI 윤리 표준 선도, 검증 서비스"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
          </div>
        </section>
      </div> {/* 첫 번째 home-page-container 종료 */}

      {/* 새로운 중간 배너 섹션 (핵심 서비스 아래, 전체 너비) */}
      <section className="challenge-banner" style={{ backgroundImage: `url(${aiDevChallengeBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <p>고객과의 분쟁? 고민하지 마세요. AIDEV 에게 문의하세요.</p>
        </div>
      </section>

      {/* 나머지 콘텐츠는 두 번째 home-page-container 안에 유지 */}
      <div className="home-page-container">
        {/* 최신 소식/공지사항 */}
        <section className="section-news">
          <h3>최신 소식 및 공지사항</h3>
          <ul>
            <li>[공지] AIDEV 2024년 정기 총회 개최 안내</li>
            <li>[뉴스] AI 개발자를 위한 법률 자문 서비스 시작</li>
            <li>[세미나] 최신 LLM 기술 동향과 적용 사례</li>
          </ul>
          <button className="detail-button">더 보기</button>
        </section>

        {/* 자주 묻는 질문 (FAQ) 일부 */}
        <section className="section-faq">
          <h3>자주 묻는 질문</h3>
          <ul>
            <li>Q: AIDEV 회원 가입은 어떻게 하나요?</li>
            <li>Q: 법률 지원 서비스는 무료인가요?</li>
          </ul>
          <button className="detail-button">더 보기</button>
        </section>

        {/* 회원 가입 유도 */}
        <section className="section-join-us">
          <h3>지금 AIDEV에 가입하고 다양한 혜택을 누리세요!</h3>
          <button className="cta-button" onClick={onSignupClick}>회원가입</button>
        </section>
      </div> {/* 두 번째 home-page-container 종료 */}
    </>
  );
}

export default HomePage;