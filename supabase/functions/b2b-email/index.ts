// 조합 B2B 의뢰(평가 신청 / 견적 의뢰) 접수 알림 이메일 (Supabase Edge Function)
//   배포: supabase functions deploy b2b-email
//   시크릿: RESEND_API_KEY (기존 공유)
//   호출: 의뢰 제출 시 프런트에서 supabase.functions.invoke('b2b-email', { body: { b2b_request_id } })
//   수신자: 조합 담당자 (tonymustbegreat@gmail.com)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FROM = '한국인공지능개발자 협동조합 <no-reply@prototypebench.org>';
const TO = 'tonymustbegreat@gmail.com'; // 조합 B2B 담당자 수신 주소

Deno.serve(async (req) => {
  try {
    const { b2b_request_id } = await req.json();
    if (!b2b_request_id) return new Response('b2b_request_id required', { status: 400 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 호출자 검증 — 로그인 사용자 본인의 의뢰만 (스팸 방지)
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });

    const { data: r } = await admin.from('b2b_requests').select('*').eq('id', b2b_request_id).single();
    if (!r) return new Response('not found', { status: 404 });

    const { data: cp } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single();
    if (!(r.requester_id === caller.id || cp?.is_admin || caller.email === 'tony@banya.ai')) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }

    const subject = `[조합 B2B] ${r.type} — ${r.company}`;
    const body = [
      `새 B2B 의뢰가 접수되었습니다.`,
      ``,
      `· 유형: ${r.type}`,
      `· 회사/기관: ${r.company}`,
      `· 담당자: ${r.contact_name}`,
      `· 이메일: ${r.email}`,
      `· 연락처: ${r.phone || '-'}`,
      `· 신청자(조합원): ${r.requester_name || '-'}`,
      ``,
      `─ 의뢰 내용 ─`,
      r.message,
      ``,
      `관리자 페이지(관리자 → B2B 의뢰)에서 처리 상태를 관리할 수 있습니다.`,
    ].join('\n');

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, reason: 'no RESEND_API_KEY' }), { headers: { 'content-type': 'application/json' } });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: r.email || undefined, subject, text: body }),
    });
    const out = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, out }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
});
