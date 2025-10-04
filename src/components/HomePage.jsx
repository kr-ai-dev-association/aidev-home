import React, { useState, useEffect } from 'react';
// assets 폴더의 이미지들을 임포트합니다. 실제 파일명과 경로에 맞게 수정해주세요.
import heroBannerBg from '../assets/hero-banner-bg.jpg';
import iconLegal from '../assets/icon-legal.png';
import iconCareer from '../assets/icon-career.png';
import iconTech from '../assets/icon-tech.png';
import iconEthics from '../assets/icon-ethics.png';
import aiDevChallengeBg from '../assets/ai dev challenge.png'; // 새로운 배경 이미지 임포트

function HomePage({ onSignupClick, scrollToSectionId, onScrollComplete, onNavigate }) { // onNavigate prop 추가
  const [openQuestionId, setOpenQuestionId] = useState(null); // FAQ를 위한 상태 관리

  const faqData = [
    {
      id: 1,
      question: 'Q: 법률 지원 서비스는 진짜 무료인가요?',
      answer: 'A: 네. 모든 회원은 AIDEV 의 인공지능 법률 서비스를 무료로 이용하실 수 있습니다.',
    },
    {
      id: 2,
      question: 'Q: 고객과의 분쟁 조정 요청 시 어떤 지원을 해 주는 건가요?',
      answer: 'A: 전담 법무팀이 구성되어 직접 회원님과 같이 고객과 대응하게 됩니다.',
    },
    {
      id: 3,
      question: 'Q: 무료 회원은 어떤 서비스를 받을 수 있나요?',
      answer: 'A: 무료 회원은 전화 상담, AI 에이전트를 사용한 법률 상담, 취업 상담, 인공지능 기술 교육 및 지원 상담 등을 이용하실 수 있습니다.',
    },
  ];

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id); // 현재 열린 질문과 같으면 닫고, 아니면 해당 질문을 엽니다.
  };

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
      {/* 상단 배너/슬라이더 - 이제 home-page-container 밖으로 이동하여 전체 너비를 차지 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${heroBannerBg})` }}>
        <div className="banner-overlay"></div> {/* 배경 이미지 위에 텍스트 가독성을 위한 오버레이 추가 */}
        <div className="banner-content">
          <h2>20만 AI 관련 종사자들의 자부심을 만들어 갑니다.</h2>
          <p>AIDEV는 AI 개발자들의 성장과 권리 보호를 위한 한국 대표 협회입니다.</p>
          <button className="cta-button" onClick={onSignupClick}>지금 가입하기</button>
        </div>
      </section>

      {/* 협회 소개 요약 및 핵심 서비스는 첫 번째 home-page-container 안에 유지 */}
      <div className="home-page-container content-area-container">
        {/* 협회 소개 요약 */}
        <section className="section-intro">
          <h3>AIDEV는 누구인가?</h3>
          <p>한국 인공지능 개발자 협회(AIDEV)는 AI 개발자들의 전문성 강화와 공정한 생태계 조성을 위해 다양한 활동을 펼치고 있습니다. 우리는 법률 지원, 사업/경력 기회 제공, 기술 역량 강화, AI 윤리 및 신뢰 구축을 통해 AI 산업 발전에 기여합니다.</p>
          <button className="detail-button" onClick={() => onNavigate('about')}>자세히 보기</button> {/* 'about' 페이지로 이동하도록 수정 */}
        </section>

        {/* 주요 서비스 소개 - id 추가 */}
        <section className="section-services" id="services-section"> {/* ID 추가 */}
          <h3>주요 서비스</h3>
          <div className="service-cards">
            <div className="service-card">
              <img src={iconLegal} alt="법률 지원 아이콘" className="service-icon" />
              <h4>법률 지원</h4>
              <p>"불공정한 계약, <br/>법적 분쟁 걱정 끝!"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
            <div className="service-card">
              <img src={iconCareer} alt="사업/경력 기회 아이콘" className="service-icon" />
              <h4>사업/경력 기회</h4>
              <p>"투명한 프로젝트 중개, <br/>역경매 플랫폼"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
            <div className="service-card">
              <img src={iconTech} alt="기술 역량 강화 아이콘" className="service-icon" />
              <h4>기술 역량 강화</h4>
              <p>"최신 기술 교육, <br/>개발 인프라 지원"</p>
              <button className="detail-button">자세히 보기</button>
            </div>
            <div className="service-card">
              <img src={iconEthics} alt="AI 윤리 및 신뢰 아이콘" className="service-icon" />
              <h4>AI 윤리 및 신뢰</h4>
              <p>"AI 윤리 표준 선도, <br/>검증 서비스"</p>
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
      <div className="home-page-container content-area-container">
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
          <ul className="faq-list"> {/* FAQ 리스트를 위한 클래스 추가 */}
            {faqData.map((item) => (
              <li key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleQuestion(item.id)}
                  aria-expanded={openQuestionId === item.id}
                >
                  {item.question}
                  <span className="toggle-icon">{openQuestionId === item.id ? '▲' : '▼'}</span> {/* 아이콘 추가 */}
                </button>
                <div
                  className={`faq-answer ${openQuestionId === item.id ? 'faq-answer-visible' : 'faq-answer-hidden'}`}
                  aria-hidden={openQuestionId !== item.id}
                >
                  <p>{item.answer}</p>
                </div>
              </li>
            ))}
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