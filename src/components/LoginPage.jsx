import React, { useState } from 'react';

function LoginPage({ onLoginSuccess, onTogglePage }) { // onLoginSuccess prop 추가
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    // 실제 로그인 로직 (예: API 호출)을 여기에 추가합니다.
    // 시뮬레이션: 로그인 성공으로 가정
    alert('로그인 시도 (시뮬레이션)!');
    onLoginSuccess(); // 로그인 성공 콜백 호출
  };

  return (
    <div className="auth-form-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">아이디:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="아이디"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="비밀번호"
          />
        </div>
        <button type="submit" className="auth-button">로그인</button>
      </form>
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