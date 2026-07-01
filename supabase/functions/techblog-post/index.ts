// tech-blog(무료 Spark 요금제, 서버 없음)에서 위키 문서를 커뮤니티에 게시하는 수신 함수
//   배포: supabase functions deploy techblog-post --no-verify-jwt
//   시크릿: TECHBLOG_FIREBASE_API_KEY, TECHBLOG_PROJECT_ID, EXTERNAL_POST_SECRET (기존)
//   인증: tech-blog 관리자 세션 토큰을 Firestore REST(공개 읽기)로 서버측 검증 → 브라우저에 시크릿 노출 없음
//   게시: 검증 통과 시 기존 external-post(서버-서버, 시크릿 보유)로 전달해 정규화·삽입을 재사용

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const J = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } });

// tech-blog 관리자 세션 토큰 검증 (Firestore REST, admin_sessions/{token})
async function verifyAdminSession(token: string): Promise<boolean> {
  const apiKey = Deno.env.get('TECHBLOG_FIREBASE_API_KEY');
  const projectId = Deno.env.get('TECHBLOG_PROJECT_ID') || 'tonys-tech-note';
  if (!apiKey || !token) return false;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admin_sessions/${encodeURIComponent(token)}?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return false;
  const doc = await res.json().catch(() => null);
  const raw = doc?.fields?.expiryTimestamp?.integerValue ?? doc?.fields?.expiryTimestamp?.doubleValue;
  const expiry = raw != null ? Number(raw) : NaN;
  return Number.isFinite(expiry) && expiry > Date.now();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    if (req.method !== 'POST') return J({ ok: false, error: 'method not allowed' }, 405);

    const { token, title, html, source_url, tags } = await req.json();
    if (!token) return J({ ok: false, error: '관리자 세션 토큰이 필요합니다.' }, 401);
    if (!title || !html) return J({ ok: false, error: 'title, html required' }, 400);

    if (!(await verifyAdminSession(String(token)))) {
      return J({ ok: false, error: '유효하지 않거나 만료된 관리자 세션입니다. 다시 로그인해 주세요.' }, 403);
    }

    const SECRET = Deno.env.get('EXTERNAL_POST_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    if (!SECRET || !SUPABASE_URL) return J({ ok: false, error: 'server not configured' }, 500);

    // 검증 통과 → 기존 external-post(정규화·삽입)로 서버-서버 전달
    const res = await fetch(`${SUPABASE_URL}/functions/v1/external-post`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-external-secret': SECRET },
      body: JSON.stringify({
        title: String(title).slice(0, 200),
        html,
        category: 'AI/LLM',
        tags: Array.isArray(tags) ? tags : undefined,
        author_name: 'Tony (tech-blog)',
        source_url: source_url || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return J({ ok: false, error: data.error || `external-post HTTP ${res.status}` }, 502);
    }
    return J({ ok: true, url: data.url, topic_id: data.topic_id });
  } catch (e) {
    return J({ ok: false, error: String(e) }, 500);
  }
});
