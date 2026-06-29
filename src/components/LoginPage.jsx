import React from 'react';
import '../App.css'; // 공통 스타일
import './AuthPage.css'; // 인증 페이지 스타일
import OAuthButtons from './OAuthButtons';

function LoginPage({ onTogglePage }) {
  return (
    <div className="auth-form-container">
      <h2>로그인</h2>
      <p className="auth-stage-desc">소셜 계정으로 로그인하세요.</p>
      <OAuthButtons verb="로그인" />
      <p>
        계정이 없으신가요?{' '}
        <button type="button" onClick={onTogglePage} className="toggle-button">
          회원가입
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
