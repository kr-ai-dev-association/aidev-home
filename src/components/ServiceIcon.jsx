import React from 'react';

// 사업 내용 / 세부 사업 섹션용 통일 라인 아이콘 세트
// 24x24 viewBox, 동일한 stroke 스타일 + 인디고→시안 그라데이션으로 통일감 부여
const PATHS = {
  // B2C/C2C — 개인 개발자(프리랜서)
  b2c: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16.5 5.5l1.8 1.8-1.8 1.8" strokeWidth="1.6" />
    </>
  ),
  // B2B — 기업/오피스
  b2b: (
    <>
      <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M14 21V9h5a1 1 0 0 1 1 1v11" />
      <path d="M7 8h3M7 12h3M7 16h3M17 13h0M17 17h0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 21h18" />
    </>
  ),
  // B2Academia — 학사모
  academia: (
    <>
      <path d="M2.5 9 12 5l9.5 4L12 13 2.5 9Z" />
      <path d="M6.5 11v4.2c0 1.7 2.5 3.1 5.5 3.1s5.5-1.4 5.5-3.1V11" />
      <path d="M21.5 9v4.5" strokeLinecap="round" />
    </>
  ),
  // 온라인 교육·인큐베이팅 — 모니터 + 재생(VOD)
  edu: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M11 8.5 15 11l-4 2.5V8.5Z" />
      <path d="M9 20.5h6M12 17v3.5" strokeLinecap="round" />
    </>
  ),
  // 바이브코딩 실습 인프라 — 코드 윈도우
  infra: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 8.5h18" />
      <circle cx="6" cy="6.2" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="6.2" r="0.6" fill="currentColor" stroke="none" />
      <path d="M9.5 12 7.5 14.2 9.5 16.4M14.5 12l2 2.2-2 2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // B2B 평가(Prototypebench) — 성능 게이지
  eval: (
    <>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M3 17h2M19 17h2M12 6v2" strokeLinecap="round" />
      <path d="M12 17l4.2-4.2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  // 취업준비생 — 서류가방 + 돋보기(구직)
  jobseeker: (
    <>
      <rect x="3" y="8.5" width="12" height="10" rx="1.6" />
      <path d="M6.5 8.5V7a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 11.5 7v1.5" />
      <path d="M3 12.5h12" />
      <circle cx="17.5" cy="14" r="3.2" />
      <path d="M19.9 16.4 22 18.5" strokeLinecap="round" />
    </>
  ),
  // 현업 개발자 — 코드 기호
  developer: (
    <>
      <path d="M9 8 4.5 12 9 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8l4.5 4L15 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 6.5 11 17.5" strokeLinecap="round" />
    </>
  ),
  // 오염 방어 — 방패 + 체크
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 3 7.4 7 9 4-1.6 7-4.7 7-9V6l-7-3Z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // 실행 기반 채점 — 체크 배지
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.2 12.2l2.6 2.6 5-5.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

function ServiceIcon({ name }) {
  const gradId = `svc-grad-${name}`;
  return (
    <span className="service-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <g
          stroke={`url(#${gradId})`}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#22d3ee' }}
        >
          {PATHS[name]}
        </g>
      </svg>
    </span>
  );
}

export default ServiceIcon;
