import React, { useState } from 'react';

function SignupPage({ onSignupSuccess, onTogglePage }) { // onSignupSuccess prop 추가
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('Signup attempt:', { username, email, password });
    // 실제 회원가입 로직 (예: API 호출)을 여기에 추가합니다.
    // 시뮬레이션: 회원가입 성공으로 가정
    onSignupSuccess(); // 회원가입 성공 콜백 호출
  };

  return (
    <div className="auth-form-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="signup-username">아이디:</label>
          <input
            type="text"
            id="signup-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="아이디"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">이메일:</label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="이메일"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">비밀번호:</label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="비밀번호"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">비밀번호 확인:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="비밀번호 확인"
          />
        </div>
        <button type="submit" className="auth-button">회원가입</button>
      </form>
      <p>
        이미 계정이 있으신가요?{' '}
        <button type="button" onClick={onTogglePage} className="toggle-button">
          로그인
        </button>
      </p>
    </div>
  );
}

export default SignupPage;