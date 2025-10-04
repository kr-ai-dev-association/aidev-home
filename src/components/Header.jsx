import React, { useState, useEffect } from 'react'; // useState와 useEffect 임포트

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
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen); // 모바일에서 로고 클릭 시 메뉴 가시성 토글
    } else {
      onNavigate('home'); // 데스크탑에서는 홈으로 이동
    }
  };

  const handleMenuItemClick = (page) => {
    onNavigate(page); // 선택한 페이지로 이동
    if (isMobile) {
      setIsMobileMenuOpen(false); // 모바일에서 메뉴 항목 선택 후 메뉴 닫기
    }
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="logo" onClick={handleLogoClick}>AIDEV</h1>
        {/* isMobile이 true이고 isMobileMenuOpen도 true일 때 'main-nav-mobile-open' 클래스 추가 */}
        <nav className={`main-nav ${isMobile && isMobileMenuOpen ? 'main-nav-mobile-open' : ''}`}>
          <ul>
            <li onClick={() => handleMenuItemClick('about')}>협회소개</li>
            <li onClick={() => handleMenuItemClick('services')}>주요 서비스</li>
            <li onClick={() => handleMenuItemClick('project')}>프로젝트</li>
            <li onClick={() => handleMenuItemClick('employment')}>취업</li>
            <li onClick={() => handleMenuItemClick('download')}>다운로드</li>
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
              <button onClick={onLogoutClick} className="header-button">로그아웃</button>
              {/* 마이페이지는 유틸리티 메뉴의 일부이므로, 메인 메뉴 닫기 로직을 적용하지 않음 */}
              <button onClick={() => onNavigate('mypage')} className="header-button">마이페이지</button>
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