import React from 'react';

function Header({ isLoggedIn, onLoginClick, onSignupClick, onLogoutClick, onNavigate }) {
  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="logo" onClick={() => onNavigate('home')}>AIDEV</h1>
        <nav className="main-nav">
          <ul>
            <li onClick={() => onNavigate('about')}>협회소개</li>
            <li onClick={() => onNavigate('services')}>주요 서비스</li>
            <li onClick={() => onNavigate('project')}>프로젝트</li>
            <li onClick={() => onNavigate('employment')}>취업</li>
            <li onClick={() => onNavigate('download')}>다운로드</li>
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