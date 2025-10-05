import React from 'react';
import './ProfilePage.css';
import profilePlaceholder from '../assets/profile-placeholder.png'; // 프로필 이미지 임포트
import linkedInIcon from '../assets/LinkedIn_icon.png'; // LinkedIn 아이콘 임포트
import instagramIcon from '../assets/Instagram_icon.png'; // Instagram 아이콘 임포트

function ProfilePage() {
  // 예시 데이터 (실제로는 API 호출 등을 통해 받아올 데이터)
  const userData = {
    name: '김안토니오',
    status: '구직 중', // '활동 가능'을 '구직 중'으로 변경
    rate: '시간당 $100 - $150',
    skills: ['웹 디자이너', '브랜드 디자이너', '제품 디자이너', '서브프레임', '피그마', '리액트'],
    badges: ['결제 활성', '신원 확인됨'],
    about: '서브프레임의 공동 창립자. 스타트업과 스케일업이 최고의 아이디어를 현실로 만들도록 돕는 디자이너 및 자문가.',
    location: '샌프란시스코, CA',
    timezone: '(GMT+8) 태평양 표준시',
    language: '한국어',
    links: [
      { icon: linkedInIcon, alt: '링크드인 아이콘', url: 'https://www.linkedin.com/in/filipskrzesinski/' },
      { icon: instagramIcon, alt: '인스타그램 아이콘', url: 'https://www.instagram.com/filipskrzesinski/' },
    ],
    projects: [
      {
        title: '서브프레임 UI 개선',
        description: '생산성을 높이고 창의력을 발휘하는 서브프레임의 최첨단 도구로 디자인 프로세스를 향상시키세요. 브랜드의 본질을 담은 맞춤형 템플릿으로 다음 프로젝트를 시작하세요. 디자인 여정을 혁신하세요.',
        image: 'https://via.placeholder.com/200x150/00bcd4/ffffff?text=Project', // Placeholder image
        tags: ['UI 아키텍트', '웹 디자이너', 'UX 전문가'],
      },
      {
        title: 'SaaS 플랫폼 재설계',
        description: '직관적인 디자인 요소로 디지털 제품을 변화시키세요. 풍부한 테마 라이브러리를 활용하여 사용자 인터페이스에 새로운 생명을 불어넣으세요. 간소화된 UI 생성 과정을 경험하세요.',
        image: 'https://via.placeholder.com/200x150/e91e63/ffffff?text=Project', // Placeholder image
        tags: ['비주얼 개발자', '제품 아티스트', 'UI 혁신가'],
      },
      {
        title: '모바일 앱 프로토타입',
        description: '실제 구성 요소로 제작된 멋진 비주얼로 모바일 앱을 강화하세요. 고유한 브랜드 스타일에 맞게 템플릿을 개인화하여 디자인 워크플로우를 향상시키세요.',
        image: 'https://via.placeholder.com/200x150/9c27b0/ffffff?text=Project', // Placeholder image
        tags: ['앱 스타일리스트', '모바일 UX 전문가', '디자인 전략가'],
      },
    ],
  };

  return (
    <div className="profile-page-container content-area-container">
      <aside className="profile-sidebar">
        <div className="profile-header-share">
          <button className="share-button" aria-label="프로필 공유">
            <span className="share-icon"></span>
          </button>
        </div>
        <div className="profile-avatar-wrapper">
          <img src={profilePlaceholder} alt="프로필 아바타" className="profile-avatar" />
          <div className="profile-status">
            <span className="status-dot available"></span> {userData.status}
          </div>
        </div>
        <h2 className="profile-name">{userData.name}</h2>
        <button className="contact-button">
          <span className="send-icon"></span> 문의하기
        </button>

        <div className="profile-section">
          <h3 className="section-title">요율</h3>
          <div className="rate-info">{userData.rate}</div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">기술 및 도구</h3>
          <div className="tags-container">
            {userData.skills.map((skill, index) => (
              <span key={index} className="tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">배지</h3>
          <div className="tags-container">
            {userData.badges.map((badge, index) => (
              <span key={index} className="tag badge-tag">
                {badge === '결제 활성' && <span className="badge-icon payment-icon"></span>}
                {badge === '신원 확인됨' && <span className="badge-icon verified-icon"></span>}
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">소개</h3>
          <p className="about-text">{userData.about}</p>
          <ul className="about-details">
            <li><span className="icon-location"></span> {userData.location}</li>
            <li><span className="icon-time"></span> {userData.timezone}</li>
            <li><span className="icon-language"></span> {userData.language}</li>
          </ul>
        </div>

        <div className="profile-section">
          <h3 className="section-title">링크</h3>
          <div className="links-container">
            {userData.links.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-icon">
                <img src={link.icon} alt={link.alt} className="social-link-image" />
              </a>
            ))}
          </div>
        </div>
      </aside>

      <main className="profile-main-content">
        <h1 className="main-title">성과를 이끄는 디자인 <span role="img" aria-label="로켓">🚀</span></h1>
        
        <nav className="profile-tabs">
          <button className="tab-button active">프로젝트</button>
          <button className="tab-button">서비스</button>
          <button className="tab-button">추천</button>
        </nav>

        <div className="add-project-section">
          <div className="add-project-card">
            <div className="add-icon">+</div>
            <div className="add-text">
              <p><strong>프로젝트 추가</strong></p>
              <p>프로젝트를 통해 최고의 기술과 경험을 보여주세요.</p>
              <button className="import-content-button">
                <span className="import-icon"></span> 몇 초 만에 콘텐츠 가져오기
              </button>
            </div>
          </div>
        </div>

        <div className="projects-list">
          {userData.projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}></div>
              <div className="project-details">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="tags-container">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <button className="more-options-button">...</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;