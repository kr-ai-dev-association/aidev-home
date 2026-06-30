import React, { useState, useEffect } from 'react'; // useState와 useEffect 임포트
import profilePlaceholder from '../assets/profile-placeholder.png'; // 프로필 이미지 임포트
import Logo from './Logo'; // 조합 로고 컴포넌트
import CoinIcon from './CoinIcon'; // 금색 코인 아이콘

function Header({ isLoggedIn, isAdmin, isMember, coins = 0, avatarUrl, unreadCount = 0, onInboxClick, onSearchClick, onLoginClick, onSignupClick, onLogoutClick, onNavigate }) {
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
        <h1 className="logo" onClick={handleLogoClick} aria-label="한국인공지능개발자 협동조합 홈으로">
          <Logo />
        </h1>
        {isMobile && ( // 모바일: 검색 + 햄버거를 헤더 우상단에 상시 노출
          <div className="mobile-header-actions">
            <button className="search-icon" aria-label="검색" onClick={onSearchClick}>🔍</button>
            <button className="mobile-menu-toggle" onClick={handleMobileMenuToggle} aria-label="메뉴 토글">
              {isMobileMenuOpen ? '✕' : '☰'} {/* 열림/닫힘 상태에 따라 아이콘 변경 */}
            </button>
          </div>
        )}
        {/* isMobile이 true이고 isMobileMenuOpen도 true일 때 'main-nav-mobile-open' 클래스 추가 */}
        <nav className={`main-nav ${isMobile && isMobileMenuOpen ? 'main-nav-mobile-open' : ''}`}>
          <ul>
            {/* '협회소개' 클릭 시 'about-intro-section'으로 스크롤 이동하도록 수정 */}
            <li onClick={() => handleMenuItemClick('about', 'about-intro-section')}>조합소개</li>
            {/* 사업·서비스 — 강의/에이전트 평가를 하위 드롭다운으로 제공 */}
            <li className="nav-has-children">
              <span className="nav-parent" onClick={() => { if (!isMobile) handleMenuItemClick('services'); }}>
                사업·서비스 <span className="nav-caret" aria-hidden="true">▾</span>
              </span>
              <ul className="nav-dropdown">
                <li onClick={() => handleMenuItemClick('services')}>사업 내용</li>
                <li onClick={() => handleMenuItemClick('courses')}>강의</li>
                <li onClick={() => handleMenuItemClick('agentbuild')}>에이전트 구축</li>
                <li onClick={() => handleMenuItemClick('agenteval')}>에이전트 평가</li>
                <li onClick={() => handleMenuItemClick('disputeservice')}>분쟁 조정</li>
              </ul>
            </li>
            <li onClick={() => handleMenuItemClick('harness')}>에이전트 하네스</li> {/* harness-collection 기반 페이지 */}
            <li onClick={() => handleMenuItemClick('employment')}>취업</li> {/* '취업' 메뉴 아이템 추가 */}
            <li onClick={() => handleMenuItemClick('community')}>커뮤니티</li> {/* '커뮤니티' 메뉴 아이템 추가 */}
            {isMember && <li onClick={() => handleMenuItemClick('vote')}>투표</li>} {/* 정회원 전용 투표 메뉴 */}
            <li onClick={() => handleMenuItemClick('faq')}>자주 묻는 질문</li> {/* 플랫폼 사용법 FAQ */}
          </ul>
        </nav>
      </div>
      <div className={`header-right ${isMobile && isMobileMenuOpen ? 'header-right-open' : ''}`}>
        <div className="utility-menu">
          {!isLoggedIn ? (
            <>
              <button onClick={onLoginClick} className="header-button">로그인</button>
              <button onClick={onSignupClick} className="header-button">회원가입</button>
            </>
          ) : (
            <>
            {/* 보유 코인 잔액 (메시지 아이콘 좌측) */}
            <button
              type="button"
              className="header-coins"
              aria-label={`보유 코인 ${coins} coin`}
              title="내 프로필에서 코인 현황 보기"
              onClick={() => handleMenuItemClick('profile')}
            >
              <CoinIcon size={17} className="header-coin-icon" />
              <span className="header-coin-amount">{Number(coins).toLocaleString()}</span>
            </button>
            {/* 메시지함 아이콘 + 안 읽음 배지 */}
            <button
              type="button"
              className="inbox-button"
              aria-label="메시지함"
              onClick={() => { onInboxClick && onInboxClick(); if (isMobile) setIsMobileMenuOpen(false); }}
            >
              <span className="inbox-icon">✉️</span>
              {unreadCount > 0 && <span className="inbox-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>
            {/* 로그인 후: 프로필 메뉴(드롭다운) — 내정보 / 관리자(권한자) / 로그아웃 */}
            <div className="profile-menu">
              <button type="button" className="profile-trigger" aria-label="프로필 메뉴">
                <img src={avatarUrl || profilePlaceholder} alt="Profile" className="header-profile-image" />
              </button>
              <ul className="profile-dropdown">
                <li onClick={() => handleMenuItemClick('profile')}>내정보</li>
                <li onClick={() => handleMenuItemClick('mediation', 'request')}>분쟁 조정 의뢰</li>
                <li onClick={() => handleMenuItemClick('myapplications')}>내 지원 관리</li>
                <li onClick={() => handleMenuItemClick('myjobs')}>내 공고 관리</li>
                {isAdmin && <li onClick={() => handleMenuItemClick('admin-hub')}>관리자</li>}
                <li
                  onClick={() => {
                    onLogoutClick();
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                >
                  로그아웃
                </li>
              </ul>
            </div>
            </>
          )}
          <select className="lang-select">
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇬🇧 English</option>
          </select>
          <button className="search-icon" aria-label="검색" onClick={onSearchClick}>🔍</button>
        </div>
      </div>
    </header>
  );
}

export default Header;