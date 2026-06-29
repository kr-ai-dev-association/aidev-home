export const config = { runtime: 'edge' };

const ORIGIN = 'https://dev.prototypebench.org';

async function sb(path: string): Promise<any[]> {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) return [];
  try {
    const r = await fetch(`${base}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    return r.ok ? ((await r.json()) as any[]) : [];
  } catch {
    return [];
  }
}

export default async function handler(): Promise<Response> {
  const [topics, jobs] = await Promise.all([
    sb('topics?select=id,last_activity_at&order=last_activity_at.desc&limit=2000'),
    sb('jobs?select=id,created_at&order=created_at.desc&limit=2000'),
  ]);

  const staticUrls = ['/', '/employment', '/community', '/about'];
  const urls: string[] = [];
  for (const u of staticUrls) {
    urls.push(`<url><loc>${ORIGIN}${u}</loc><changefreq>daily</changefreq></url>`);
  }
  for (const t of topics) {
    const lm = t.last_activity_at ? `<lastmod>${new Date(t.last_activity_at).toISOString()}</lastmod>` : '';
    urls.push(`<url><loc>${ORIGIN}/community/topic/${t.id}</loc>${lm}</url>`);
  }
  for (const j of jobs) {
    const lm = j.created_at ? `<lastmod>${new Date(j.created_at).toISOString()}</lastmod>` : '';
    urls.push(`<url><loc>${ORIGIN}/employment/job/${j.id}</loc>${lm}</url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600, s-maxage=3600' },
  });
}
