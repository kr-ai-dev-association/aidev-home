import { useState } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header'; // Header 컴포넌트 임포트
import HomePage from './components/HomePage'; // HomePage 컴포넌트 임포트
import Footer from './components/Footer'; // Footer 컴포넌트 임포트
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [currentPage, setCurrentPage] = useState('home'); // 현재 페이지 상태 관리

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('home'); // 로그인 성공 시 홈 페이지로 이동
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home'); // 로그아웃 시 홈 페이지로 이동
    alert('로그아웃 되었습니다.');
  };

  // SignupPage에서 회원가입 성공 후 로그인 페이지로 이동하도록 수정
  const handleSignupSuccess = () => {
    alert('회원가입이 완료되었습니다. 로그인 해주세요.');
    setCurrentPage('login');
  };

  let content;
  switch (currentPage) {
    case 'login':
      content = <LoginPage onLoginSuccess={handleLoginSuccess} onTogglePage={() => handleNavigate('signup')} />;
      break;
    case 'signup':
      content = <SignupPage onSignupSuccess={handleSignupSuccess} onTogglePage={() => handleNavigate('login')} />;
      break;
    case 'home':
    default:
      content = <HomePage onSignupClick={() => handleNavigate('signup')} />;
      break;
  }

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => handleNavigate('login')}
        onSignupClick={() => handleNavigate('signup')}
        onLogoutClick={handleLogout}
        onNavigate={handleNavigate}
      />
      <main className="main-content">
        {content}
      </main>
      <Footer /> {/* Footer 컴포넌트 추가 */}
    </div>
  );
}

export default App;