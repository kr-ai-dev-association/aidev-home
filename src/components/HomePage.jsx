import React, { useState, useEffect } from 'react';
// assets 폴더의 이미지들을 임포트합니다. 실제 파일명과 경로에 맞게 수정해주세요.
import heroBannerBg from '../assets/hero-banner-bg.jpg';
import aiDevChallengeBg from '../assets/ai dev challenge.png'; // 중간 배너 배경 이미지
import ServiceIcon from './ServiceIcon'; // 통일 라인 아이콘 세트
import YouTubeEmbed from './YouTubeEmbed'; // 소개 영상 임베드
import { useI18n } from '../i18n/I18nProvider'; // 다국어(i18n)

function HomePage({ onSignupClick, scrollToSectionId, onScrollComplete, onNavigate }) { // onNavigate prop 추가
  const { t } = useI18n();
  const [openQuestionId, setOpenQuestionId] = useState(null); // FAQ를 위한 상태 관리

  const faqData = [
    { id: 1, question: t('home.faqQ1'), answer: t('home.faqA1') },
    { id: 2, question: t('home.faqQ2'), answer: t('home.faqA2') },
    { id: 3, question: t('home.faqQ3'), answer: t('home.faqA3') },
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
    <div className="home-landing"> {/* 다크 테크 프리미엄 테마 스코프 래퍼 */}
      {/* 상단 배너/슬라이더 - 전체 너비를 차지 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${heroBannerBg})` }}>
        <div className="banner-overlay"></div> {/* 배경 이미지 위에 텍스트 가독성을 위한 오버레이 추가 */}
        <div className="banner-grid" aria-hidden="true"></div> {/* 테크 그리드 장식 */}
        <div className="banner-content">
          <span className="hero-eyebrow">{t('home.heroEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('home.heroTitle') }} />
          <p>{t('home.heroDesc')}</p>
          <div className="hero-actions">
            <button className="cta-button" onClick={onSignupClick}>{t('home.heroJoin')}</button>
            <button className="ghost-button" onClick={() => onNavigate('about')}>{t('home.heroAbout')}</button>
          </div>
        </div>
      </section>

      {/* 조합 소개 요약 및 핵심 비즈니스 모델은 첫 번째 home-page-container 안에 유지 */}
      <div className="home-page-container content-area-container">
        {/* 조합 소개 요약 */}
        <section className="section-intro">
          <h3>{t('home.introTitle')}</h3>
          <YouTubeEmbed videoId="fCvwZqC-e8M" title="한국인공지능개발자 협동조합 소개 영상" />
          <p className="section-lead" dangerouslySetInnerHTML={{ __html: t('home.introLead') }} />
          <p>{t('home.introBody')}</p>
          <button className="detail-button" onClick={() => onNavigate('about')}>{t('common.detail')}</button>
        </section>

        {/* AI 시대 고용 현실 — 대학생/취업준비생/개발자 문제 진단 (제목·리드는 상단 인트로로 이동) */}
        <section className="section-employment" id="employment-section">
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="academia" />
              <span className="track-badge">{t('home.dxStudentBadge')}</span>
              <h4>{t('home.dxStudentTitle')}</h4>
              <p>{t('home.dxStudentDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="jobseeker" />
              <span className="track-badge">{t('home.dxSeekerBadge')}</span>
              <h4>{t('home.dxSeekerTitle')}</h4>
              <p>{t('home.dxSeekerDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="developer" />
              <span className="track-badge">{t('home.dxDevBadge')}</span>
              <h4>{t('home.dxDevTitle')}</h4>
              <p>{t('home.dxDevDesc')}</p>
            </div>
          </div>
          <p className="employment-bridge" dangerouslySetInnerHTML={{ __html: t('home.bridge') }} />
        </section>

        {/* 핵심 비즈니스 모델 - 트리플 트랙 전략 */}
        <section className="section-services" id="services-section"> {/* ID 추가 (헤더 '주요 서비스' 스크롤 타겟) */}
          <h3>{t('home.bizTitle')}</h3>
          <p className="section-lead">{t('home.bizLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="b2c" />
              <span className="track-badge">B2C / C2C</span>
              <h4>{t('home.bizB2cTitle')}</h4>
              <p>{t('home.bizB2cDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <span className="track-badge">B2B</span>
              <h4>{t('home.bizB2bTitle')}</h4>
              <p>{t('home.bizB2bDesc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="academia" />
              <span className="track-badge">B2Academia</span>
              <h4>{t('home.bizAcaTitle')}</h4>
              <p>{t('home.bizAcaDesc')}</p>
            </div>
          </div>
        </section>

        {/* 세부 사업 내용 및 AI 플랫폼 서비스 */}
        <section className="section-services" id="platform-section">
          <h3>{t('home.platTitle')}</h3>
          <p className="section-lead">{t('home.platLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="edu" />
              <h4>{t('home.plat1Title')}</h4>
              <p>{t('home.plat1Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>{t('home.plat2Title')}</h4>
              <p>{t('home.plat2Desc')}</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>{t('home.plat3Title')}</h4>
              <p>{t('home.plat3Desc')}</p>
            </div>
          </div>
        </section>
      </div> {/* 첫 번째 home-page-container 종료 */}

      {/* 중간 배너 섹션 (핵심 서비스 아래, 전체 너비) */}
      <section className="challenge-banner" style={{ backgroundImage: `url(${aiDevChallengeBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <p>{t('home.midBanner')}</p>
        </div>
      </section>

      {/* 나머지 콘텐츠는 두 번째 home-page-container 안에 유지 */}
      <div className="home-page-container content-area-container">
        {/* 강사·크리에이터 수익 인센티브 */}
        <section className="section-incentive" id="incentive-section">
          <h3>{t('home.incTitle')}</h3>
          <p className="section-lead">{t('home.incLead')}</p>
          <div className="service-cards">
            <div className="service-card">
              <strong className="incentive-figure">70%</strong>
              <h4>{t('home.inc1Title')}</h4>
              <p>{t('home.inc1Desc')}</p>
            </div>
            <div className="service-card">
              <strong className="incentive-figure">80%+</strong>
              <h4>{t('home.inc2Title')}</h4>
              <p>{t('home.inc2Desc')}</p>
            </div>
            <div className="service-card">
              <strong className="incentive-figure">★</strong>
              <h4>{t('home.inc3Title')}</h4>
              <p>{t('home.inc3Desc')}</p>
            </div>
          </div>
        </section>

        {/* 최신 소식/공지사항 */}
        <section className="section-news">
          <h3>{t('home.newsTitle')}</h3>
          <ul>
            <li>{t('home.news1')}</li>
            <li>{t('home.news2')}</li>
            <li>{t('home.news3')}</li>
          </ul>
          <button className="detail-button" onClick={() => onNavigate('community', null, '공지사항')}>{t('common.more')}</button>
        </section>

        {/* 자주 묻는 질문 (FAQ) 일부 */}
        <section className="section-faq">
          <h3>{t('home.faqTitle')}</h3>
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
          <button className="detail-button" onClick={() => onNavigate('faq')}>{t('common.more')}</button>
        </section>

        {/* 회원 가입 유도 */}
        <section className="section-join-us">
          <h3>{t('home.joinTitle')}</h3>
          <button className="cta-button" onClick={onSignupClick}>{t('home.joinBtn')}</button>
        </section>
      </div> {/* 두 번째 home-page-container 종료 */}
    </div>
  );
}

export default HomePage;
