import React from 'react';
import { unstable_createNodejsStream } from '@vercel/og';

// Node 런타임 서버리스 함수(엣지 미들웨어와 분리되어 @vercel/og 번들 충돌 회피)

async function loadGoogleFont(font: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@800&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
    const m = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype|woff2)'\)/);
    if (m) {
      const res = await fetch(m[1]);
      if (res.ok) return await res.arrayBuffer();
    }
  } catch {
    /* noop */
  }
  return null;
}

const h = React.createElement;

export default async function handler(req: any, res: any): Promise<void> {
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const title = (url.searchParams.get('title') || '한국인공지능개발자 협동조합').slice(0, 70);
  const tag = (url.searchParams.get('tag') || '').slice(0, 28);
  const kind = (url.searchParams.get('kind') || '').slice(0, 10);

  const brand = '한국인공지능개발자 협동조합';
  const fontData = await loadGoogleFont('Noto Sans KR', `${title}${tag}${kind}${brand}AI개발자협동조합 ·`);

  const badges: any[] = [];
  if (kind) {
    badges.push(
      h('div', { key: 'k', style: { fontSize: 26, fontWeight: 800, color: '#0a0e1a', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', padding: '8px 22px', borderRadius: 999 } }, kind),
    );
  }
  if (tag) {
    badges.push(
      h('div', { key: 't', style: { fontSize: 26, fontWeight: 700, color: '#67e8f9', border: '2px solid rgba(103,232,249,0.5)', padding: '8px 22px', borderRadius: 999 } }, tag),
    );
  }

  const tree = h(
    'div',
    { style: { width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px', background: 'linear-gradient(135deg,#0a0e1a 0%,#111726 60%,#1a1140 100%)', color: '#e2e8f0' } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
      h('div', { style: { width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, color: '#0a0e1a' } }, 'AI'),
      h('div', { style: { fontSize: 30, fontWeight: 800, color: '#cbd5e1' } }, brand),
    ),
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
      badges.length ? h('div', { style: { display: 'flex', gap: '14px' } }, badges) : null,
      h('div', { style: { fontSize: 64, fontWeight: 800, lineHeight: 1.2, color: '#f8fafc', display: 'flex' } }, title),
    ),
    h('div', { style: { fontSize: 24, color: '#94a3b8' } }, 'dev.prototypebench.org'),
  );

  const stream = await unstable_createNodejsStream(tree as any, {
    width: 1200,
    height: 630,
    fonts: fontData ? [{ name: 'Noto Sans KR', data: fontData, weight: 800, style: 'normal' }] : [],
  });

  res.statusCode = 200;
  res.setHeader('content-type', 'image/png');
  res.setHeader('cache-control', 'public, immutable, no-transform, max-age=86400');
  stream.pipe(res);
}
