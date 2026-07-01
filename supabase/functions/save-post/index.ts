// 커뮤니티 글(공지 포함) 저장 — Cloudflare WAF 우회용
//   배포: supabase functions deploy save-post
//   · 리치 HTML 본문을 브라우저에서 직접 PATCH 하면 WAF가 XSS로 오인해 연결을 끊음(ERR_CONNECTION_CLOSED)
//   · 본문을 Base64 로 전달 → 함수에서 디코드 후 service_role 로 업데이트
//   · 권한: 작성자 또는 관리자

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const J = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { post_id, title, content_b64 } = await req.json();
    if (!post_id || !content_b64) return J({ ok: false, error: 'post_id, content_b64 required' }, 400);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 호출자 검증
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return J({ ok: false, error: 'unauthorized' }, 401);

    const { data: post } = await admin.from('posts').select('id, author_id, topic_id').eq('id', post_id).single();
    if (!post) return J({ ok: false, error: 'not found' }, 404);

    const { data: cp } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single();
    const isAdmin = !!cp?.is_admin || caller.email === 'tony@banya.ai';
    if (!(post.author_id === caller.id || isAdmin)) {
      return J({ ok: false, error: 'forbidden' }, 403);
    }

    // Base64 → UTF-8 HTML
    const bin = atob(content_b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const html = new TextDecoder().decode(bytes);

    const { error: pErr } = await admin.from('posts').update({ content: html }).eq('id', post_id);
    if (pErr) return J({ ok: false, error: pErr.message }, 500);

    if (typeof title === 'string' && title.trim()) {
      await admin.from('topics').update({ title: title.trim() }).eq('id', post.topic_id);
    }

    return J({ ok: true });
  } catch (e) {
    return J({ ok: false, error: String(e) }, 500);
  }
});
