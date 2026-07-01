export const config = { runtime: 'edge' };

// 커뮤니티 게시글(/community/topic/:id) 요청 시, SNS 크롤러(카톡·페북·X·링크드인·레딧·슬랙 봇)가
// 글별 썸네일/제목/요약을 볼 수 있도록 index.html 에 Open Graph 메타를 주입해 응답한다.
//   · 봇/사람 구분 없이 동일 HTML 을 반환(SPA 는 그대로 부팅) → SEO(구글)에도 이득
//   · 썸네일: 본문 첫 이미지 → 없으면 /api/og 로 제목 카드 자동 생성
//   · s-maxage 캐시로 함수 호출 최소화

const ORIGIN = 'https://dev.prototypebench.org';

async function sbOne(path: string): Promise<any | null> {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) return null;
  try {
    const r = await fetch(`${base}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!r.ok) return null;
    const arr = (await r.json()) as any[];
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  return (html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function firstImage(html: string): string | null {
  const m = (html || '').match(/<img\b[^>]*\bsrc\s*=\s*["'](https?:\/\/[^"']+)["']/i);
  return m ? m[1] : null;
}

function escapeAttr(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// property/name 메타의 content 를 교체하거나 없으면 </head> 앞에 삽입
function setMeta(html: string, attr: 'property' | 'name', key: string, value: string): string {
  const v = escapeAttr(value);
  const re = new RegExp(`(<meta\\s+${attr}=["']${key}["']\\s+content=["'])[^"']*(["'])`, 'i');
  if (re.test(html)) return html.replace(re, `$1${v}$2`);
  return html.replace(/<\/head>/i, `    <meta ${attr}="${key}" content="${v}" />\n</head>`);
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';
  const origin = `${url.protocol}//${url.host}`.replace(/^http:/, 'https:') || ORIGIN;

  // 원본 SPA index.html (정적 파일 — rewrite 대상 아님)
  let html = '';
  try {
    html = await (await fetch(`${origin}/index.html`, { headers: { 'cache-control': 'no-cache' } })).text();
  } catch {
    return new Response('index fetch failed', { status: 500 });
  }

  const topic = id ? await sbOne(`topics?id=eq.${encodeURIComponent(id)}&select=id,title,category,tags`) : null;
  if (topic) {
    const post = await sbOne(`posts?topic_id=eq.${encodeURIComponent(id)}&select=content&order=created_at.asc&limit=1`);
    const brand = '한국인공지능개발자 협동조합';
    const title = `${topic.title || '커뮤니티 게시글'} · ${brand}`;
    const summaryRaw = stripHtml(post?.content || '');
    const description = (summaryRaw || `${topic.category || '커뮤니티'} · ${brand}`).slice(0, 180);
    const canonical = `${origin}/community/topic/${topic.id}`;

    const img =
      firstImage(post?.content || '') ||
      `${origin}/api/og?title=${encodeURIComponent((topic.title || '').slice(0, 70))}&tag=${encodeURIComponent(
        (topic.category || '').slice(0, 28),
      )}&kind=${encodeURIComponent('커뮤니티')}`;

    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(title)}</title>`);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:type', 'article');
    html = setMeta(html, 'property', 'og:title', title);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'property', 'og:url', canonical);
    html = setMeta(html, 'property', 'og:image', img);
    html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
    html = setMeta(html, 'name', 'twitter:title', title);
    html = setMeta(html, 'name', 'twitter:description', description);
    html = setMeta(html, 'name', 'twitter:image', img);
  }

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
