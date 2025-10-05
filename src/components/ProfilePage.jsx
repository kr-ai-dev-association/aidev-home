import React from 'react';
import './ProfilePage.css';
import profilePlaceholder from '../assets/profile-placeholder.png'; // 프로필 이미지 임포트
import linkedInIcon from '../assets/LinkedIn_icon.png'; // LinkedIn 아이콘 임포트
import instagramIcon from '../assets/Instagram_icon.png'; // Instagram 아이콘 임포트
import youtubeIcon from '../assets/youtube_icon.png'; // YouTube 아이콘 임포트
import githubIcon from '../assets/github_icon.svg'; // GitHub 아이콘 임포트

function ProfilePage() {
  // YouTube URL에서 썸네일 이미지를 추출하는 헬퍼 함수
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId = '';
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        videoId = urlObj.searchParams.get('v');
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // 고품질 기본 썸네일
      }
    } catch (e) {
      console.error("YouTube 썸네일 URL 파싱 오류:", url, e);
    }
    return null;
  };

  // 예시 데이터 (실제로는 API 호출 등을 통해 받아올 데이터)
  const userData = {
    name: '김안토니오',
    status: '구직 중',
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
        title: '발달장애인을 위한 로컬 AI 어시스턴트 앱, Life Help Agent App',
        description: '발달장애인을 위한 100% 로컬 운영(현재 Apple Macbook Pro M4) AI 어시스턴트 앱으로, 음성 상호작용, 얼굴 인식, 로컬 ComfyUI 서버를 통한 실시간 이미지 생성 기능을 제공하여 클라우드 의존성 없이 개인화된 일상생활 지원을 제공합니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['Kotlin', 'LLM', 'Ollama', 'Gemma3', 'Llamma3', 'Pytorch', 'Flask', 'Jetpack Compose', 'Android SDK 35', 'MVVM Architecture', 'ML Kit Face Detection', 'ComfyUI', 'SDXL/FLUX Image generation model', 'VITS TTS'],
        youtubeUrl: 'https://youtu.be/6cvpTI22_PE?si=zKLmha7nSYeEGEEQ',
        githubUrl: 'https://github.com/DAIOSFoundation/pwooda',
      },
      {
        title: 'LLM 보안 솔루션, LLM Spear&Shield',
        description: '프롬프트 인젝션, 악의적 파인튜닝, 다중 에이전트 시스템 위험에 대한 선제적 AI 보안 솔루션을 제공합니다. 포괄적인 다중 알고리즘 취약점 평가 시스템, 한국어 특화 처리, 자동 차단 및 위험 시각화가 포함된 실시간 프롬프트 인젝션 탐지를 특징으로 합니다. 고급 기능에는 AI 해석 가능성 (XAI), 핵심 모델 신원 강화, DPO 기반 안전 메커니즘, 신뢰 향상을 위한 워터마킹이 포함됩니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['LLM', 'Ollama', 'Gemma3', 'Llamma3', 'React', 'Flask', 'PyTorch', 'PEFT', 'TRL', 'BERT-score', 'Al Friend', 'Self-implemented ROUGE'],
        youtubeUrl: 'https://youtu.be/1PFGf-572NM?si=INcidWlPV7qLTmhk',
        githubUrl: 'https://github.com/DAIOSFoundation/LLM-HACK',
      },
      {
        title: '대구은행 블록체인 인프라 구축',
        description: '대구은행(DGB)을 위한 DID(분산 신원) 및 블록체인 기술을 통합한 모바일 게이트 패스 시스템을 개발했습니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['Hyperledger', 'Go (Programming Language)', 'DAG', 'React', 'JavaScript'],
        youtubeUrl: null,
        githubUrl: null,
      },
      {
        title: '솔라나 기반 모바일 암호화폐 스테이킹 서비스',
        description: 'DEX 기반 글로벌 암호화폐 스테이킹 서비스입니다. 탈 중앙화 암호화폐 지갑과 탈 중앙화 거래소를 구현하여 간편하게 스테이킹 및 트레이딩이 가능합니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['Solana', 'Rust', 'React Native', 'TypeScript'],
        youtubeUrl: 'https://youtu.be/fqTJaei5xJg?si=-IK_S9TOS8CRe1L4',
        githubUrl: null,
      },
      {
        title: '이더리움 기반 옵션 거래 시스템',
        description: '암호화폐 현물, 옵션, 파생상품을 브라우저에 내장된 암호화폐 지갑과 중앙화된 거래소에서 쉽게 거래 가능한 시스템을 개발하였습니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['Ethereum', 'React', 'TypeScript', 'Hardhat', 'Solidity', 'DAIOS'],
        youtubeUrl: 'https://youtu.be/5aeP5g4RNos?si=-8fhKUZrnQrJZyA5',
        githubUrl: null,
      },
      {
        title: '챗봇 빌더',
        description: '다양한 기기에 임베드 가능한 자연어 처리 모듈 생성을 위한 챗봇 빌더 플랫폼을 설계했습니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['NLP', '신경망 언어 모델', 'Django', 'TensorFlow', '딥러닝', '머신러닝', 'Android'],
        youtubeUrl: 'https://youtu.be/MqZhj5O35r0?si=vDt3_cLhxn57hVwf',
        githubUrl: null,
      },
      {
        title: '아시아 음식 이미지 분류 및 큐레이션 서비스',
        description: '아시아 음식 분류를 위한 컨볼루션 신경망(CNN)을 개발하고, 음식 이미지에 대한 설명을 제공하기 위해 NLP 기능과 통합했습니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['TensorFlow', 'Inceloption', '신경망 언어 모델', 'RNN', '게이트 순환 유닛 (GRU)', 'Flask'],
        youtubeUrl: 'https://youtu.be/7A2qVwX6MeY?si=cx1llQE-2HtpyFxL',
        githubUrl: null,
      },
      {
        title: 'MAHA 프로토타입, 자연어 처리 모듈 개발',
        description: '사용자를 위한 인간과 같은 의사소통을 촉진하는 인공지능을 만들기 위해 노력했습니다.',
        image: '', // 동적으로 생성될 예정
        skills: ['NLP', '신경망 언어 모델', 'Django', 'TensorFlow', '딥러닝', 'RNN', '게이트 순환 유닛 (GRU)'],
        youtubeUrl: 'https://youtu.be/3i8oVWKUffI?si=RW6HxDV9O4D2JXsC',
        githubUrl: null,
      },
    ],
  };

  // 프로젝트 데이터 전처리: 썸네일 이미지 URL 생성
  const processedProjects = userData.projects.map(project => {
    let imageUrl = null;

    if (project.youtubeUrl) {
      const ytThumbnail = getYouTubeThumbnail(project.youtubeUrl);
      if (ytThumbnail) {
        imageUrl = ytThumbnail;
      }
    }

    // YouTube 썸네일이 없거나 가져오지 못한 경우, 프로젝트 이름 기반의 플레이스홀더 사용
    if (!imageUrl) {
      const placeholderText = project.title.split(' ')[0].substring(0, 10) || '프로젝트'; // 제목의 첫 단어 사용 (최대 10자)
      imageUrl = `https://via.placeholder.com/200x150/cccccc/333333?text=${encodeURIComponent(placeholderText)}`;
    }

    return { ...project, image: imageUrl };
  });

  // 전처리된 프로젝트 목록으로 업데이트
  userData.projects = processedProjects;


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
                  {project.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="tag">{skill}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.youtubeUrl && (
                    <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" className="project-link-icon">
                      <img src={youtubeIcon} alt="YouTube Icon" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link-icon">
                      <img src={githubIcon} alt="GitHub Icon" />
                    </a>
                  )}
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