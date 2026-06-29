import React from 'react';

// 한국인공지능개발자 협동조합 로고 (SVG 벡터)
// 심볼: 육각형 칩(AI/테크) 안에 중앙 노드와 3개의 노드를 연결한 신경망 = AI + 협동(연결)
// 워드마크: 인디고→시안 그라데이션
function Logo() {
  return (
    <span className="brand-logo">
      <svg
        className="brand-mark"
        viewBox="0 0 48 48"
        width="40"
        height="40"
        role="img"
        aria-label="한국인공지능개발자 협동조합 로고"
      >
        <defs>
          <linearGradient id="brandGrad" x1="6" y1="44" x2="42" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {/* 육각형 칩 */}
        <path
          d="M24 3.5 L41.8 13.75 V34.25 L24 44.5 L6.2 34.25 V13.75 Z"
          fill="rgba(99,102,241,0.10)"
          stroke="url(#brandGrad)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* 연결선 (협동/네트워크) */}
        <g stroke="url(#brandGrad)" strokeWidth="2" strokeLinecap="round">
          <line x1="24" y1="24" x2="24" y2="13.5" />
          <line x1="24" y1="24" x2="15" y2="31.5" />
          <line x1="24" y1="24" x2="33" y2="31.5" />
        </g>
        {/* 노드 */}
        <circle cx="24" cy="24" r="3.6" fill="#22d3ee" />
        <circle cx="24" cy="13.5" r="2.8" fill="#a5b4fc" />
        <circle cx="15" cy="31.5" r="2.8" fill="#a5b4fc" />
        <circle cx="33" cy="31.5" r="2.8" fill="#a5b4fc" />
      </svg>
      <span className="brand-text">
        <span className="brand-text-main">AI개발자</span>
        <span className="brand-text-sub">협동조합</span>
      </span>
    </span>
  );
}

export default Logo;
