import { next } from '@vercel/edge';

export const config = {
  matcher: ['/community/topic/:id*', '/employment/job/:id*'],
};

// 주의: 'kakaotalk' 전체가 아니라 스크랩 봇 토큰 'kakaotalk-scrap' 만 매칭한다.
// 카카오톡 인앱 브라우저 UA 는 'KAKAOTALK 10.x' 형태라, 'kakaotalk' 로 잡으면
// 링크를 여는 실제 사용자까지 봇 프리렌더(SPA 없는 SEO 스텁)를 받아 본문이 안 뜬다.
const BOT_RE =
  /(facebookexternalhit|facebot|twitterbot|slackbot|slack-imgproxy|linkedinbot|redditbot|kakaotalk-scrap|telegrambot|whatsapp|discordbot|googlebot|bingbot|applebot|duckduckbot|baiduspider|yandex|petalbot|pinterest|skypeuripreview|embedly|nuzzel|vkshare|w3c_validator|gptbot|oai-searchbot|chatgpt|claudebot|claude-web|anthropic|perplexitybot|google-extended|ccbot|bytespider|amazonbot|cohere-ai|diffbot)/i;

const SITE = '한국인공지능개발자 협동조합';

function esc(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(html: string, max = 200): string {
  const text = (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max) + '…' : text;
}

async function sb(path: string): Promise<any[]> {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) return [];
  try {
    const r = await fetch(`${base}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!r.ok) return [];
    return (await r.json()) as any[];
  } catch {
    return [];
  }
}

function page(opts: {
  url: string;
  title: string;
  desc: string;
  image: string;
  kind: string;
  jsonld: object;
}): Response {
  const { url, title, desc, image, kind, jsonld } = opts;
  const t = esc(title);
  const d = esc(desc);
  const html = `<!doctype html>
<html lang="ko"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t} · ${SITE}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${esc(image)}">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head><body>
<main>
<p>${esc(kind)}</p>
<h1>${t}</h1>
<p>${d}</p>
<p><a href="${esc(url)}">${SITE}에서 보기</a></p>
</main>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=600' },
  });
}

export default async function middleware(request: Request): Promise<Response> {
  const ua = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const isBot = BOT_RE.test(ua) || url.searchParams.get('_og') === '1';
  if (!isBot) return next();

  const origin = url.origin;
  const ogBase = `${origin}/api/og`;

  // /community/topic/:id
  let m = url.pathname.match(/^\/community\/topic\/([0-9a-f-]{36})/i);
  if (m) {
    const id = m[1];
    const topics = await sb(`topics?id=eq.${id}&select=title,category,tags`);
    const t = topics[0];
    if (t) {
      const posts = await sb(`posts?topic_id=eq.${id}&select=content&order=created_at.asc&limit=1`);
      const desc = stripHtml(posts[0]?.content || '') || `${SITE} 커뮤니티 글`;
      const tag = t.category || '커뮤니티';
      const image = `${ogBase}?kind=${encodeURIComponent('커뮤니티')}&tag=${encodeURIComponent(tag)}&title=${encodeURIComponent(t.title)}`;
      const pageUrl = `${origin}/community/topic/${id}`;
      return page({
        url: pageUrl,
        title: t.title,
        desc,
        image,
        kind: `커뮤니티 · ${tag}`,
        jsonld: {
          '@context': 'https://schema.org',
          '@type': 'DiscussionForumPosting',
          headline: t.title,
          articleBody: desc,
          url: pageUrl,
          isPartOf: { '@type': 'WebSite', name: SITE, url: origin },
        },
      });
    }
  }

  // /employment/job/:id
  m = url.pathname.match(/^\/employment\/job\/([0-9a-f-]{36})/i);
  if (m) {
    const id = m[1];
    const jobs = await sb(`jobs?id=eq.${id}&select=title,board_type,description,details`);
    const j = jobs[0];
    if (j) {
      const desc = stripHtml(j.description || '') || `${SITE} 취업 공고`;
      const tag = j.board_type || '채용';
      const image = `${ogBase}?kind=${encodeURIComponent('취업')}&tag=${encodeURIComponent(tag)}&title=${encodeURIComponent(j.title)}`;
      const pageUrl = `${origin}/employment/job/${id}`;
      return page({
        url: pageUrl,
        title: j.title,
        desc,
        image,
        kind: `취업 · ${tag}`,
        jsonld: {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: j.title,
          description: desc,
          url: pageUrl,
          hiringOrganization: { '@type': 'Organization', name: j.details?.company || SITE },
          employmentType: j.details?.employment_type || undefined,
          jobLocation: j.details?.location
            ? { '@type': 'Place', address: j.details.location }
            : undefined,
        },
      });
    }
  }

  return next();
}
