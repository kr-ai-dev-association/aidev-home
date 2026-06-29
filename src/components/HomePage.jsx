import React, { useState, useEffect } from 'react';
// assets 폴더의 이미지들을 임포트합니다. 실제 파일명과 경로에 맞게 수정해주세요.
import heroBannerBg from '../assets/hero-banner-bg.jpg';
import aiDevChallengeBg from '../assets/ai dev challenge.png'; // 중간 배너 배경 이미지
import ServiceIcon from './ServiceIcon'; // 통일 라인 아이콘 세트

function HomePage({ onSignupClick, scrollToSectionId, onScrollComplete, onNavigate }) { // onNavigate prop 추가
  const [openQuestionId, setOpenQuestionId] = useState(null); // FAQ를 위한 상태 관리

  const faqData = [
    {
      id: 1,
      question: 'Q: 협동조합 가입은 어떻게 하나요?',
      answer: 'A: 출자금 규모와 무관하게 1인 1표의 의결권을 가지며, IT 프리랜서·AI 개발자·대학생·예비 창업자라면 누구나 소비자/직원 조합원으로 가입하실 수 있습니다. 기업·기관은 사업자 조합원으로 참여 가능합니다.',
    },
    {
      id: 2,
      question: 'Q: 바이브코딩 실습 환경은 무료인가요?',
      answer: 'A: 네. 개인 PC 사양에 구애받지 않고 브라우저에서 즉시 실행 가능한 클라우드 Web IDE 실습 환경을 무상으로 제공합니다(고사양 GPU 등 일부 기능은 프리미엄 과금).',
    },
    {
      id: 3,
      question: 'Q: 강사로 참여하면 어떤 보상을 받나요?',
      answer: 'A: VOD 단과 강의 순수익의 70%를 강사에게 정산하고, 대학·기업 오프라인 특강은 계약 강사료의 80% 이상을 즉시 지급합니다. 우수 크리에이터에게는 연말 콘텐츠 기여 특별 배당도 지급됩니다.',
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
    <div className="home-landing"> {/* 다크 테크 프리미엄 테마 스코프 래퍼 */}
      {/* 상단 배너/슬라이더 - 전체 너비를 차지 */}
      <section className="hero-banner" style={{ backgroundImage: `url(${heroBannerBg})` }}>
        <div className="banner-overlay"></div> {/* 배경 이미지 위에 텍스트 가독성을 위한 오버레이 추가 */}
        <div className="banner-grid" aria-hidden="true"></div> {/* 테크 그리드 장식 */}
        <div className="banner-content">
          <span className="hero-eyebrow">AI · 협동조합 · 플랫폼</span>
          <h2>대한민국 AI 생태계의 미래를 선도하는<br />개발자 중심 플랫폼</h2>
          <p>한국인공지능개발자 협동조합은 바이브코딩 생태계 확산과 현업 개발자의 권익 보호를 주도하는 통합 AI 개발·평가 플랫폼입니다.</p>
          <div className="hero-actions">
            <button className="cta-button" onClick={onSignupClick}>지금 조합원 가입하기</button>
            <button className="ghost-button" onClick={() => onNavigate('about')}>조합 소개 보기</button>
          </div>
        </div>
      </section>

      {/* 조합 소개 요약 및 핵심 비즈니스 모델은 첫 번째 home-page-container 안에 유지 */}
      <div className="home-page-container content-area-container">
        {/* 조합 소개 요약 */}
        <section className="section-intro">
          <h3>한국인공지능개발자 협동조합은?</h3>
          <p>출자금 규모와 무관하게 모든 조합원이 1인 1표를 행사하는 민주적 협동조합입니다. 단순한 오프라인 협회를 넘어, 강력한 기술 스택을 갖춘 '통합 AI 개발 및 평가 플랫폼'을 구축·운영하며 개인(B2C)·기업(B2B)·학계(B2Academia)를 아우르는 생태계를 만들어갑니다.</p>
          <button className="detail-button" onClick={() => onNavigate('about')}>자세히 보기</button>
        </section>

        {/* AI 시대 고용 현실 — 대학생/취업준비생/개발자 문제 진단 */}
        <section className="section-employment" id="employment-section">
          <h3>AI가 바꾸는 개발자 고용의 현실</h3>
          <p className="section-lead">
            'Fable 5' 같은 최첨단 모델과 미국의 사용 제한 조치는 한 가지 신호를 보냅니다 — AI는 이미 국가안보 자산이 되었고,
            접근할 수 있는 소수와 그렇지 못한 다수로 노동 가치가 갈라집니다. 그 끝은 IT 직군의 <strong>소득 초(超)양극화</strong>입니다.
          </p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="academia" />
              <span className="track-badge">대학생</span>
              <h4>신입 채용 절벽</h4>
              <p>AI가 신입이 맡던 업무를 대체하며 '첫 일자리' 자체가 사라지고 있습니다. 정규 커리큘럼은 변화 속도를 따라가지 못해, 졸업과 동시에 시장은 이미 바뀌어 있습니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="jobseeker" />
              <span className="track-badge">취업준비생</span>
              <h4>비개발자와의 무한 경쟁</h4>
              <p>누구나 AI로 코딩하는 시대, 비개발자까지 AI를 활용해 기회를 가져갑니다. 고가의 AI 도구·인프라 접근 장벽 속에서 '대(大) 1인 창업'으로 내몰립니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="developer" />
              <span className="track-badge">현업 개발자</span>
              <h4>중급 개발자 해고 리스크</h4>
              <p>생산성 폭발로 중간 허리층이 대량 구조조정 위험에 놓입니다. 최신 AI를 다루는 소수만 고소득을 누리고, 프리랜서는 협상력·법적 보호마저 취약합니다.</p>
            </div>
          </div>
          <p className="employment-bridge">
            그래서 <strong>협동조합</strong>이 필요합니다 — 새로운 교육과 공정한 가치 순환으로, 누구나 최신 AI 인프라에 접근하고 함께 성장하도록.
          </p>
        </section>

        {/* 핵심 비즈니스 모델 - 트리플 트랙 전략 */}
        <section className="section-services" id="services-section"> {/* ID 추가 (헤더 '주요 서비스' 스크롤 타겟) */}
          <h3>사업 내용</h3>
          <p className="section-lead">개인·기업·학계를 아우르며 플랫폼을 기반으로 생태계를 록인(Lock-in)하는 전략을 전개합니다.</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="b2c" />
              <span className="track-badge">B2C / C2C</span>
              <h4>현업 프리랜서·개발자</h4>
              <p>바이브코딩 무료 툴·클라우드 제공, 교육, 구인/구직 매칭, 법률 지원으로 압도적 트래픽과 최고급 인재 풀을 확보합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="b2b" />
              <span className="track-badge">B2B</span>
              <h4>기업 조합원</h4>
              <p>맞춤형 sLLM 구축, 컨설팅, Prototypebench 연계 에이전트 평가로 SaaS 수익화와 고부가가치 엔터프라이즈 프로젝트를 수주합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="academia" />
              <span className="track-badge">B2Academia</span>
              <h4>대학 CS/AI 학부</h4>
              <p>정규 커리큘럼 제공, 실습용 AI 교육 인프라 지원, 인턴십 연계로 안정적 라이선스 수익과 우수 주니어 개발자를 선점합니다.</p>
            </div>
          </div>
        </section>

        {/* 세부 사업 내용 및 AI 플랫폼 서비스 */}
        <section className="section-services" id="platform-section">
          <h3>세부 사업 내용 및 AI 플랫폼 서비스</h3>
          <p className="section-lead">단순한 오프라인 협회를 넘어, 강력한 기술 스택을 갖춘 '통합 AI 개발 및 평가 플랫폼'을 구축·운영합니다.</p>
          <div className="service-cards">
            <div className="service-card">
              <ServiceIcon name="edu" />
              <h4>① 온라인 교육·창업 인큐베이팅</h4>
              <p>매월 최신 AI 동향 세미나와 바이브코딩·sLLM 실무 VOD 교육을 제공하고, Virtual Hackathon 팀빌딩 및 초기 AI 스타트업 인큐베이팅을 지원합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="infra" />
              <h4>② 바이브코딩 실습 인프라·오픈소스</h4>
              <p>브라우저에서 즉시 실행 가능한 클라우드 샌드박스 Web IDE를 제공하고, 구인/구직 마켓플레이스와 제휴 법무법인 무료 법률·노무 상담으로 프리랜서 권익을 보호합니다.</p>
            </div>
            <div className="service-card">
              <ServiceIcon name="eval" />
              <h4>③ [핵심 B2B] Unsloth · Prototypebench 연계</h4>
              <p>Unsloth 연동으로 기업 맞춤형 LLM을 빠르고 가볍게 튜닝·양자화하고, Prototypebench와 연계해 성능·추론속도·환각·안전성을 검증한 공인 평가 리포트를 발급합니다.</p>
            </div>
          </div>
        </section>
      </div> {/* 첫 번째 home-page-container 종료 */}

      {/* 중간 배너 섹션 (핵심 서비스 아래, 전체 너비) */}
      <section className="challenge-banner" style={{ backgroundImage: `url(${aiDevChallengeBg})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <p>혼자 고민하지 마세요. 인프라부터 평가까지, 협동조합이 함께합니다.</p>
        </div>
      </section>

      {/* 나머지 콘텐츠는 두 번째 home-page-container 안에 유지 */}
      <div className="home-page-container content-area-container">
        {/* 강사·크리에이터 수익 인센티브 */}
        <section className="section-incentive" id="incentive-section">
          <h3>강사·크리에이터 수익 인센티브</h3>
          <p className="section-lead">양질의 콘텐츠 제작을 독려하기 위해 업계 최고 수준의 수익 분배 원칙을 운영합니다.</p>
          <div className="service-cards">
            <div className="service-card">
              <strong className="incentive-figure">70%</strong>
              <h4>VOD 강의 수익 분배</h4>
              <p>강사가 제작한 VOD 단과 강의 판매 시, 결제 수수료·운영비를 제외한 순수익의 70%를 강사에게 직접 정산합니다. 구독 멤버십은 누적 시청 시간에 비례해 매월 분배합니다.</p>
            </div>
            <div className="service-card">
              <strong className="incentive-figure">80%+</strong>
              <h4>오프라인·B2B 특강</h4>
              <p>조합 영업망을 통한 대학 산학협력 과정·기업 맞춤형 특강 파견 시, 전체 계약 강사료의 80% 이상을 해당 강사에게 즉시 지급해 안정적 고수익을 보장합니다.</p>
            </div>
            <div className="service-card">
              <strong className="incentive-figure">★</strong>
              <h4>우수 크리에이터 특별 배당</h4>
              <p>수강생 평점·리뷰 수·총 시청 시간을 종합 평가해 최우수 강사(Top Tier)를 선정하고, 연말 잉여금 배당 시 '콘텐츠 기여 특별 배당금'을 추가 지급합니다.</p>
            </div>
          </div>
        </section>

        {/* 최신 소식/공지사항 */}
        <section className="section-news">
          <h3>최신 소식 및 공지사항</h3>
          <ul>
            <li>[공지] 한국인공지능개발자 협동조합 창립총회 및 발기인 모집 안내</li>
            <li>[뉴스] 인프라 보유 법인 발기인 합류 — 클라우드 무상 공급 MOU 체결</li>
            <li>[세미나] Unsloth 기반 sLLM 양자화·파인튜닝 실무 워크숍</li>
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
          <h3>지금 협동조합에 가입하고 1인 1표의 주인이 되세요!</h3>
          <button className="cta-button" onClick={onSignupClick}>조합원 가입</button>
        </section>
      </div> {/* 두 번째 home-page-container 종료 */}
    </div>
  );
}

export default HomePage;
