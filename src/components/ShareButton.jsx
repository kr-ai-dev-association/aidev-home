import React, { useState, useEffect, useRef } from 'react';
import './ShareButton.css';
import { useI18n } from '../i18n/I18nProvider';

const Icon = {
  copy: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  fb: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  li: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
  rd: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.95c.043 1.193 1.024 2.149 2.232 2.149 1.234 0 2.236-1.001 2.236-2.236 0-1.234-1.002-2.236-2.236-2.236-.877 0-1.633.507-1.997 1.243l-4.481-1.06a.486.486 0 00-.586.345l-1.65 5.189c-2.764.066-5.26.825-7.094 2.034a2.638 2.638 0 00-1.84-.746C1.192 9.134 0 10.32 0 11.779c0 1.07.645 1.992 1.564 2.404-.04.254-.062.512-.062.776 0 3.927 4.571 7.114 10.21 7.114 5.639 0 10.21-3.187 10.21-7.114 0-.264-.022-.522-.062-.776.919-.412 1.564-1.334 1.564-2.404zM6.778 14.13a1.66 1.66 0 113.319.001 1.66 1.66 0 01-3.319-.001zm9.495 4.435c-1.04 1.04-3.038 1.119-3.621 1.119-.582 0-2.582-.08-3.622-1.119a.394.394 0 01.556-.556c.658.658 2.064.891 3.066.891 1.002 0 2.408-.233 3.066-.891a.394.394 0 01.556.556zm-.235-2.777a1.66 1.66 0 11.001-3.319 1.66 1.66 0 01-.001 3.319z" />
    </svg>
  ),
  kakao: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 3C6.486 3 2 6.54 2 10.905c0 2.79 1.86 5.24 4.657 6.627-.153.53-.983 3.39-1.016 3.616 0 0-.02.17.09.235.11.065.239.014.239.014.317-.044 3.673-2.4 4.253-2.81.567.08 1.15.123 1.777.123 5.514 0 10-3.54 10-7.905C22 6.54 17.514 3 12 3z" />
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
  insta: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
};

function ShareButton({ url, title, text }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const [guide, setGuide] = useState(null); // 붙여넣기 안내 대상 라벨

  const u = encodeURIComponent(url);
  const tt = encodeURIComponent(title || '');
  // 웹 공유 인텐트(새 탭) — OG 메타로 썸네일/요약 표시
  const targets = [
    { key: 'x', label: t('share.targetX'), color: '#e7e9ea', href: `https://twitter.com/intent/tweet?url=${u}&text=${tt}` },
    { key: 'fb', label: t('share.targetFb'), color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: 'li', label: t('share.targetLi'), color: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { key: 'rd', label: t('share.targetRd'), color: '#FF4500', href: `https://www.reddit.com/submit?url=${u}&title=${tt}` },
  ];
  // 웹 게시 인텐트가 없는 앱 — 링크 복사 후 붙여넣으면 OG 미리보기가 표시됨
  const copyTargets = [
    { key: 'kakao', label: t('share.targetKakao'), color: '#FEE500', unfurl: true },
    { key: 'slack', label: t('share.targetSlack'), color: '#4A154B', unfurl: true },
    { key: 'insta', label: t('share.targetInsta'), color: '#E4405F', unfurl: false },
  ];

  const nativeShare = async () => {
    try {
      if (navigator.share) { await navigator.share({ title, text, url }); setOpen(false); return true; }
    } catch { /* 취소 등 */ }
    return false;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t('share.copyPrompt'), url);
    }
  };

  // 카톡/슬랙/인스타 — 링크 복사 + 붙여넣기 안내(모바일이면 네이티브 시트 우선)
  const copyGuide = async (tgt) => {
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      if (await nativeShare()) return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(t('share.copyPrompt'), url);
    }
    setGuide(tgt);
  };

  const onMain = async () => {
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      if (await nativeShare()) return;
    }
    setOpen((o) => !o);
  };

  return (
    <div className="share-wrap" ref={ref}>
      <button type="button" className="nt-btn ghost share-btn" onClick={onMain}>{t('share.button')}</button>
      {open && (
        <div className="share-pop">
          <button type="button" className="share-item" onClick={copy}>
            <span className="share-ico">{Icon.copy}</span>
            {copied ? t('share.copied') : t('share.copyLink')}
          </button>
          {navigator.share && (
            <button type="button" className="share-item" onClick={nativeShare}>
              <span className="share-ico">{Icon.share}</span>
              {t('share.nativeShare')}
            </button>
          )}
          <div className="share-divider" />
          {targets.map((s) => (
            <a key={s.key} className="share-item" href={s.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <span className="share-ico" style={{ color: s.color }}>{Icon[s.key]}</span>
              {t('share.shareTo', { target: s.label })}
            </a>
          ))}
          {copyTargets.map((s) => (
            <button key={s.key} type="button" className="share-item" onClick={() => copyGuide(s)}>
              <span className="share-ico" style={{ color: s.color }}>{Icon[s.key]}</span>
              {t('share.shareTo', { target: s.label })}
            </button>
          ))}
          <p className="share-note">
            {guide
              ? (guide.unfurl ? t('share.unfurlGuide', { target: guide.label }) : t('share.instaGuide'))
              : t('share.note')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
