import { useState } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header'; // Header 컴포넌트 임포트
import HomePage from './components/HomePage'; // HomePage 컴포넌트 임포트
import Footer from './components/Footer'; // Footer 컴포넌트 임포트
import AboutPage from './components/AboutPage'; // AboutPage 컴포넌트 임포트
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [currentPage, setCurrentPage] = useState('home'); // 현재 페이지 상태 관리
  const [scrollToSection, setScrollToSection] = useState(null); // 스크롤할 섹션 ID 상태 추가

  // handleNavigate 함수를 수정하여 sectionId를 선택적으로 받을 수 있도록 합니다.
  const handleNavigate = (page, sectionId = null) => {
    if (page === 'services') {
      setCurrentPage('home'); // HomePage가 렌더링되도록 보장
      setScrollToSection('services-section'); // 스크롤 타겟 ID 설정
    } else if (page === 'about' && sectionId) { // 'about' 페이지로 이동하면서 특정 섹션으로 스크롤할 경우
      setCurrentPage('about');
      setScrollToSection(sectionId);
    }
    else {
      setCurrentPage(page);
      setScrollToSection(null); // 다른 페이지로 이동 시 스크롤 타겟 초기화
    }
  };

  const handleScrollComplete = () => {
    setScrollToSection(null); // 스크롤 완료 후 스크롤 타겟 초기화
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('home'); // 로그인 성공 시 홈 페이지로 이동
    setScrollToSection(null); // 로그인 시 스크롤 타겟 초기화
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home'); // 로그아웃 시 홈 페이지로 이동
    setScrollToSection(null); // 로그아웃 시 스크롤 타겟 초기화
    alert('로그아웃 되었습니다.');
  };

  // SignupPage에서 회원가입 성공 후 로그인 페이지로 이동하도록 수정
  const handleSignupSuccess = () => {
    alert('회원가입이 완료되었습니다. 로그인 해주세요.');
    setCurrentPage('login');
    setScrollToSection(null); // 회원가입 시 스크롤 타겟 초기화
  };

  let content;
  switch (currentPage) {
    case 'login':
      content = <LoginPage onLoginSuccess={handleLoginSuccess} onTogglePage={() => handleNavigate('signup')} />;
      break;
    case 'signup':
      content = <SignupPage onSignupSuccess={handleSignupSuccess} onTogglePage={() => handleNavigate('login')} />;
      break;
    case 'about': // 'about' 페이지 케이스 수정
      content = (
        <AboutPage
          scrollToSectionId={scrollToSection} // AboutPage에 스크롤 타겟 전달
          onScrollComplete={handleScrollComplete} // AboutPage에 스크롤 완료 콜백 전달
        />
      );
      break;
    case 'home':
    default:
      content = (
        <HomePage
          onSignupClick={() => handleNavigate('signup')}
          scrollToSectionId={scrollToSection} // HomePage에 스크롤 타겟 전달
          onScrollComplete={handleScrollComplete} // HomePage에 스크롤 완료 콜백 전달
          onNavigate={handleNavigate} // HomePage에도 onNavigate prop 전달
        />
      );
      break;
  }

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => handleNavigate('login')}
        onSignupClick={() => handleNavigate('signup')}
        onLogoutClick={handleLogout}
        onNavigate={handleNavigate} // onNavigate 함수는 'services', 'about' 등 모든 페이지 이동을 처리
      />
      <main className="main-content">
        {content}
      </main>
      <Footer /> {/* Footer 컴포넌트 추가 */}
    </div>
  );
}

export default App;
