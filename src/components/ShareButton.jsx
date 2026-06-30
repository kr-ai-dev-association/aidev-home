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

  const u = encodeURIComponent(url);
  const tt = encodeURIComponent(title || '');
  const targets = [
    { key: 'x', label: t('share.targetX'), color: '#e7e9ea', href: `https://twitter.com/intent/tweet?url=${u}&text=${tt}` },
    { key: 'fb', label: t('share.targetFb'), color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: 'li', label: t('share.targetLi'), color: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { key: 'rd', label: t('share.targetRd'), color: '#FF4500', href: `https://www.reddit.com/submit?url=${u}&title=${tt}` },
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
          <p className="share-note">{t('share.note')}</p>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
