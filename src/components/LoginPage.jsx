import React, { useEffect, useCallback } from 'react';
import '../App.css'; // 공통 스타일
import './AuthPage.css'; // 새로 생성한 인증 페이지 스타일

// 소셜 로그인 아이콘 이미지 임포트
// Google 아이콘은 Google GIS 스크립트가 직접 렌더링하므로 더 이상 필요하지 않습니다.
import appleIcon from '../assets/appleid_button@2x.png'; // Apple 아이콘
import kakaoIcon from '../assets/kakao_login_medium_wide.png'; // Kakao 아이콘

function LoginPage({ onLoginSuccess, onTogglePage }) {

  // Google 로그인 성공 시 호출될 콜백 함수
  const handleCredentialResponse = useCallback((response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // 실제 애플리케이션에서는 이 토큰을 서버로 보내 인증 과정을 완료해야 합니다.
    // 여기서는 시뮬레이션으로 로그인 성공 처리
    alert("Google 로그인 성공 (시뮬레이션)! JWT 토큰: " + response.credential.substring(0, 30) + "...");
    onLoginSuccess(); 
  }, [onLoginSuccess]);

  useEffect(() => {
    // Google Identity Services 스크립트 로드
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true; // defer 속성 추가
    script.onload = () => {
      // 스크립트 로드 완료 후 Google GIS 초기화
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // .env 파일에 VITE_GOOGLE_CLIENT_ID 추가 필요
          callback: handleCredentialResponse
        });
        window.google.id = window.google.accounts.id; // 전역 스코프에 id 객체 설정, 필요시

        window.google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large", text: "signin_with", shape: "rectangular", width: "300" } // Google 버튼 커스터마이징
        );
        // window.google.accounts.id.prompt(); // One Tap dialog는 사용자 경험을 위해 필요할 때만 호출
      }
    };
    document.body.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택 사항이지만 깔끔하게 관리)
      // 실제 환경에서는 한 번 로드된 GIS 스크립트를 제거하지 않는 경우가 많습니다.
      // 여기서는 예시를 위해 제거 로직을 포함합니다.
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Google ID 서비스 정리 (필요시)
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.cancel();
        window.google.accounts.id.disableAutoSelect();
      }
    };
  }, [handleCredentialResponse]); // handleCredentialResponse를 의존성 배열에 추가

  // Apple 및 Kakao 로그인은 기존 방식 유지 (시뮬레이션)
  const handleSocialLogin = (provider) => {
    console.log(`${provider} 로그인 시도...`);
    // 실제 소셜 로그인 API 호출 로직이 여기에 들어갑니다.
    // 성공 시 onLoginSuccess() 호출
    alert(`${provider} 로그인 시도 (시뮬레이션)!`);
    onLoginSuccess(); 
  };

  return (
    <div className="auth-form-container">
      <h2>로그인</h2>
      <div className="social-login-buttons">
        {/* Google 로그인 버튼은 Google GIS 스크립트에 의해 렌더링됩니다. */}
        <div id="buttonDiv" className="google-login-button-wrapper"></div>
        
        <button 
          onClick={() => handleSocialLogin('Apple')} 
          className="social-login-button apple-login-button"
        >
          <img src={appleIcon} alt="Apple Icon" />
          {/* Apple로 로그인 텍스트 제거 */}
        </button>
        <button 
          onClick={() => handleSocialLogin('Kakao')} 
          className="social-login-button kakao-login-button"
        >
          <img src={kakaoIcon} alt="Kakao Icon" />
          {/* 카카오로 로그인 텍스트 제거 */}
        </button>
      </div>
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