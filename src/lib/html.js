import DOMPurify from 'dompurify';

// 저장된 HTML을 안전하게 정화(XSS 방지)
export const sanitize = (html) =>
  DOMPurify.sanitize(html || '', { USE_PROFILES: { html: true } });

// HTML → 평문 (빈 값 검사용)
export const htmlToText = (html) => {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || '').trim();
};

// 에디터 내용이 비었는지 (Quill 빈 값은 "<p><br></p>")
export const isEmptyHtml = (html) => htmlToText(html) === '';
