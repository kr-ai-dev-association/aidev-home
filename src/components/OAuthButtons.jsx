import React from 'react';
import { supabase } from '../lib/supabase';
import googleIcon from '../assets/google-icon.png';

// Google / GitHub OAuth 버튼 (Supabase signInWithOAuth)
// verb: '로그인' | '회원가입'
function OAuthButtons({ verb = '로그인' }) {
  const signIn = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin, // 로컬/프로덕션 자동 대응
      },
    });
    if (error) alert(`인증 오류: ${error.message}`);
  };

  return (
    <div className="social-login-buttons">
      <button type="button" className="google-auth-button" onClick={() => signIn('google')}>
        <img src={googleIcon} alt="" aria-hidden="true" />
        Google로 {verb}
      </button>
      <button type="button" className="github-auth-button" onClick={() => signIn('github')}>
        <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub로 {verb}
      </button>
    </div>
  );
}

export default OAuthButtons;
