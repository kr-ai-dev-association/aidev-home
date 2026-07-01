// 외부(gdoc-fixer 등)에서 커뮤니티 게시글을 생성하는 수신 함수 (Supabase Edge Function)
//   배포: supabase functions deploy external-post --no-verify-jwt
//   시크릿: supabase secrets set EXTERNAL_POST_SECRET=<공유 시크릿>
//   호출: 서버-서버 (Firebase Function publishToCommunity) — 헤더 x-external-secret 로 인증
//   · 자기완결 HTML(Tailwind CDN·인라인 스타일)을 커뮤니티 안전 HTML로 정규화 후 topics+posts insert
//   · service_role 로 삽입(RLS 우회), 작성자는 협동조합 사무국(수퍼관리자 계정)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 게시 작성자 — 협동조합 사무국(수퍼관리자 tony) 계정
const SYSTEM_AUTHOR_ID = '53120483-1d6b-4487-b535-7e189ec0ce33';
const DEFAULT_AUTHOR_NAME = '협동조합 사무국';

// 자기완결 HTML → 커뮤니티 안전 HTML (클래스·인라인스타일·스크립트 제거, 시맨틱 태그+이미지 유지)
function normalizeHtml(raw: string): string {
  let body = raw || '';
  const m = raw.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (m) body = m[1];
  return body
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\/?(?:html|head|body)\b[^>]*>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link\b[^>]*\/?>/gi, '')
    .replace(/<meta\b[^>]*\/?>/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/\s+class="[^"]*"/gi, '')
    .replace(/\s+class='[^']*'/gi, '')
    .replace(/\s+style="[^"]*"/gi, '')
    .replace(/\s+style='[^']*'/gi, '')
    .replace(/(\s*\n){3,}/g, '\n\n')
    .trim();
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

    const SECRET = Deno.env.get('EXTERNAL_POST_SECRET');
    if (!SECRET) return new Response(JSON.stringify({ ok: false, error: 'secret not configured' }), { status: 500, headers: { 'content-type': 'application/json' } });
    if ((req.headers.get('x-external-secret') || '') !== SECRET) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }

    const { title, html, category, tags, author_name, source_url } = await req.json();
    if (!title || !html) return new Response(JSON.stringify({ ok: false, error: 'title, html required' }), { status: 400, headers: { 'content-type': 'application/json' } });

    let content = normalizeHtml(html);
    if (source_url) {
      content += `\n<p><a href="${source_url}" target="_blank" rel="noreferrer">🔗 원본 문서 보기</a></p>`;
    }
    if (!content) return new Response(JSON.stringify({ ok: false, error: 'empty content after normalize' }), { status: 400, headers: { 'content-type': 'application/json' } });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const authorName = (typeof author_name === 'string' && author_name.trim()) ? author_name.trim() : DEFAULT_AUTHOR_NAME;
    const cat = (typeof category === 'string' && category.trim()) ? category.trim() : 'AI/LLM';
    const tagArr = Array.isArray(tags) ? tags.filter((t) => typeof t === 'string' && t.trim()).slice(0, 8) : [];

    // 1) 주제 생성
    const { data: topic, error: tErr } = await admin.from('topics').insert({
      title: String(title).trim().slice(0, 200),
      category: cat,
      tags: tagArr,
      author_id: SYSTEM_AUTHOR_ID,
      author_name: authorName,
      last_activity_by: authorName,
    }).select().single();
    if (tErr || !topic) return new Response(JSON.stringify({ ok: false, error: tErr?.message || 'topic insert failed' }), { status: 500, headers: { 'content-type': 'application/json' } });

    // 2) 본문 게시글 생성
    const { error: pErr } = await admin.from('posts').insert({
      topic_id: topic.id,
      author_id: SYSTEM_AUTHOR_ID,
      author_name: authorName,
      content,
    });
    if (pErr) {
      // 롤백(주제 삭제)
      await admin.from('topics').delete().eq('id', topic.id);
      return new Response(JSON.stringify({ ok: false, error: pErr.message }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      ok: true,
      topic_id: topic.id,
      url: `https://dev.prototypebench.org/community/topic/${topic.id}`,
    }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
});
