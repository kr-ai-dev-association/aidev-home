// 가입/정회원 승인 안내 이메일 (Supabase Edge Function)
//   배포: supabase functions deploy approval-email
//   호출: 관리자가 승인 시 프런트에서 supabase.functions.invoke('approval-email', { body: { target_id, kind } })
//   kind: 'approved'(법인 가입 승인) | 'member'(정회원 승인)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FROM = '한국인공지능개발자 협동조합 <no-reply@prototypebench.org>';
const SITE = 'https://dev.prototypebench.org';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { target_id, kind } = await req.json();
    if (!target_id) return new Response('target_id required', { status: 400, headers: cors });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 호출자 검증 — 관리자만
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: { ...cors, 'content-type': 'application/json' } });
    const { data: cp } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single();
    if (!(cp?.is_admin || caller.email === 'tony@banya.ai')) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { ...cors, 'content-type': 'application/json' } });
    }

    const { data: p } = await admin.from('profiles').select('name, email').eq('id', target_id).single();
    if (!p) return new Response('not found', { status: 404, headers: cors });
    if (!RESEND_API_KEY || !p.email) {
      return new Response(JSON.stringify({ ok: false, reason: 'no RESEND_API_KEY or no email' }), { headers: { ...cors, 'content-type': 'application/json' } });
    }

    const isMember = kind === 'member';
    const subject = isMember
      ? `[한국인공지능개발자 협동조합] 정회원 승인 안내`
      : `[한국인공지능개발자 협동조합] 가입 승인 안내`;
    const body = [
      `${p.name || ''}님, 안녕하세요. 한국인공지능개발자 협동조합입니다.`,
      ``,
      isMember
        ? `회원님이 정회원으로 승인되었습니다. 이제 투표 참여, 외주 프로젝트 상세 열람 등 정회원 전용 기능을 이용하실 수 있습니다.`
        : `회원님의 가입이 승인되었습니다. 이제 로그인하여 조합 플랫폼의 모든 기능을 이용하실 수 있습니다.`,
      ``,
      `▶ 플랫폼 바로가기: ${SITE}`,
      ``,
      `감사합니다.`,
      `— 한국인공지능개발자 협동조합`,
    ].join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [p.email], subject, text: body }),
    });
    const out = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, out }), { headers: { ...cors, 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { ...cors, 'content-type': 'application/json' } });
  }
});
