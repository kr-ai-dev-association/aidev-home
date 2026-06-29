import React from 'react';

// 금색 코인 아이콘 (이모지 대신 SVG로 그려 색상/선명도 보장)
function CoinIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      className={`coin-svg ${className}`} aria-hidden="true" focusable="false"
    >
      <defs>
        <linearGradient id="coinGoldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="0.45" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill="url(#coinGoldGrad)" stroke="#a45a09" strokeWidth="1" />
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="#fffbeb" strokeWidth="1.1" opacity="0.65" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8a4b08" fontFamily="system-ui, sans-serif">C</text>
    </svg>
  );
}

export default CoinIcon;
