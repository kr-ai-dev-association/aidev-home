import DOMPurify from 'dompurify';

// 유튜브/비메오 임베드만 허용 (그 외 iframe은 제거 — XSS/clickjacking 방지)
const SAFE_IFRAME = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;
let hookAdded = false;
function ensureHook() {
  if (hookAdded || typeof window === 'undefined') return;
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
      const src = node.getAttribute && node.getAttribute('src');
      if (!src || !SAFE_IFRAME.test(src)) {
        node.parentNode && node.parentNode.removeChild(node);
      }
    }
  });
  // 인라인 style 허용하되 클릭재킹/오버레이 악용 속성은 제거
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (data.attrName === 'style' && data.attrValue) {
      data.attrValue = data.attrValue
        .replace(/position\s*:\s*(fixed|absolute|sticky)/gi, '')
        .replace(/z-index\s*:[^;]*/gi, '');
    }
  });
  hookAdded = true;
}

// 저장된 HTML을 안전하게 정화(XSS 방지) — 이미지/유튜브 임베드 + 인라인 스타일 허용
export const sanitize = (html) => {
  ensureHook();
  return DOMPurify.sanitize(html || '', {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'style'],
  });
};

// HTML → 평문 (빈 값 검사용)
export const htmlToText = (html) => {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || '').trim();
};

// 에디터 내용이 비었는지 (Quill 빈 값은 "<p><br></p>")
export const isEmptyHtml = (html) => htmlToText(html) === '';
