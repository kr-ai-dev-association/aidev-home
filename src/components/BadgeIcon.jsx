import React from 'react';

// 배지 메달리온 — 분야/티어별 색상 링 + 글리프(이모지)로 모양을 생성
// props: color(테두리/배경 색), emoji(글리프), size(px), ring(테두리 형태: 'circle'|'shield')
function BadgeIcon({ color = '#6366f1', emoji = '🎖️', size = 56, title }) {
  const id = `bg-${color.replace('#', '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" role="img" aria-label={title || 'badge'}>
      <defs>
        <radialGradient id={id} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      {/* 메달 본체 */}
      <circle cx="28" cy="28" r="24" fill={`url(#${id})`} stroke={color} strokeWidth="2.5" />
      {/* 내부 링 */}
      <circle cx="28" cy="28" r="18" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      {/* 글리프 */}
      <text x="28" y="29" textAnchor="middle" dominantBaseline="central" fontSize="22">{emoji}</text>
    </svg>
  );
}

export default BadgeIcon;
