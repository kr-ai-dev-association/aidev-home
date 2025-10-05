import React, { useState, useEffect } from 'react'; // useState와 useEffect 임포트
import profilePlaceholder from '../assets/profile-placeholder.png'; // 프로필 이미지 임포트

function Header({ isLoggedIn, onLoginClick, onSignupClick, onLogoutClick, onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 현재 화면이 모바일 뷰인지 확인하는 함수 (CSS 미디어 쿼리 브레이크포인트와 일치)
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 모바일 여부 확인
    checkIsMobile();

    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkIsMobile);

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []); // 빈 배열은 이 효과가 마운트 시 한 번 실행되고 언마운트 시 정리됨을 의미

  const handleLogoClick = () => {
    onNavigate('home', null); // 항상 홈 페이지로 이동하며 스크롤 타겟 초기화 (상단으로 이동)
    if (isMobileMenuOpen) { // 모바일 메뉴가 열려있었다면 닫기
      setIsMobileMenuOpen(false);
    }
  };

  // handleMenuItemClick 함수를 수정하여 sectionId를 선택적으로 받을 수 있도록 합니다.
  const handleMenuItemClick = (page, sectionId = null) => {
    onNavigate(page, sectionId); // 선택한 페이지와 sectionId로 이동 요청
    if (isMobile) {
      setIsMobileMenuOpen(false); // 모바일에서 메뉴 항목 선택 후 메뉴 닫기
    }
  };

  const handleMobileMenuToggle = () => { // 모바일 메뉴 토글 함수 추가
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="logo" onClick={handleLogoClick}>AIDEV</h1>
        {isMobile && ( // 모바일에서만 햄버거 버튼 렌더링
          <button className="mobile-menu-toggle" onClick={handleMobileMenuToggle} aria-label="메뉴 토글">
            {isMobileMenuOpen ? '✕' : '☰'} {/* 열림/닫힘 상태에 따라 아이콘 변경 */}
          </button>
        )}
        {/* isMobile이 true이고 isMobileMenuOpen도 true일 때 'main-nav-mobile-open' 클래스 추가 */}
        <nav className={`main-nav ${isMobile && isMobileMenuOpen ? 'main-nav-mobile-open' : ''}`}>
          <ul>
            {/* '협회소개' 클릭 시 'about-intro-section'으로 스크롤 이동하도록 수정 */}
            <li onClick={() => handleMenuItemClick('about', 'about-intro-section')}>협회소개</li>
            <li onClick={() => handleMenuItemClick('services')}>주요 서비스</li> {/* 'services'로 페이지 이동 요청 */}
            {/* <li onClick={() => handleMenuItemClick('project')}>프로젝트</li> */} {/* 프로젝트 메뉴 삭제 */}
            <li onClick={() => handleMenuItemClick('employment')}>취업</li> {/* '취업' 메뉴 아이템 추가 */}
            <li onClick={() => handleMenuItemClick('community')}>커뮤니티</li> {/* '커뮤니티' 메뉴 아이템 추가 */}
            <li onClick={() => handleMenuItemClick('download', 'download-intro-section')}>다운로드</li> {/* '다운로드' 메뉴 아이템 추가 및 스크롤 타겟 설정 */}
          </ul>
        </nav>
      </div>
      <div className="header-right">
        <div className="utility-menu">
          {!isLoggedIn ? (
            <>
              <button onClick={onLoginClick} className="header-button">로그인</button>
              <button onClick={onSignupClick} className="header-button">회원가입</button>
            </>
          ) : (
            <>
              {/* 로그인 후에는 프로필 이미지로 변경되며, 클릭 시 마이페이지(profile)로 이동 */}
              <img
                src={profilePlaceholder}
                alt="Profile"
                className="header-profile-image"
                onClick={() => onNavigate('profile')} // 프로필 이미지 클릭 시 profile 페이지로 이동
              />
              {/* 로그아웃 버튼을 프로필 이미지 우측으로 이동 */}
              <button onClick={onLogoutClick} className="header-button">로그아웃</button>
            </>
          )}
          <select className="lang-select">
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇬🇧 English</option>
          </select>
          <button className="search-icon" aria-label="검색">🔍</button>
        </div>
      </div>
    </header>
  );
}

export default Header;