// 투표 안건 등록 안내 이메일 (Supabase Edge Function)
//   배포: supabase functions deploy vote-email
//   시크릿: RESEND_API_KEY (기존 공유)
//   호출: 수퍼관리자가 안건 등록 시 프런트에서 supabase.functions.invoke('vote-email', { body: { vote_id } })
//   수신자: 전(全) 정회원 (BCC), 본문에 투표 내용 요약 + 투표 페이지 링크 포함

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FROM = '한국인공지능개발자 협동조합 <no-reply@prototypebench.org>';
const VOTE_URL = 'https://dev.prototypebench.org/vote';

function htmlToText(html: string) {
  return (html || '')
    .replace(/<br\s*\/?>(?=)/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { vote_id } = await req.json();
    if (!vote_id) return new Response('vote_id required', { status: 400, headers: cors });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 호출자 검증 — 관리자/수퍼관리자만
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: { ...cors, 'content-type': 'application/json' } });
    const { data: cp } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single();
    if (!(cp?.is_admin || caller.email === 'tony@banya.ai')) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { ...cors, 'content-type': 'application/json' } });
    }

    const { data: vote } = await admin.from('votes').select('*').eq('id', vote_id).single();
    if (!vote) return new Response('not found', { status: 404, headers: cors });

    // 전 정회원 이메일
    const { data: members } = await admin.from('profiles').select('email').eq('is_member', true);
    const emails = [...new Set((members || []).map((m: any) => m.email).filter(Boolean))];
    if (!RESEND_API_KEY || emails.length === 0) {
      return new Response(JSON.stringify({ ok: false, reason: 'no RESEND_API_KEY or no members', count: emails.length }), { headers: { ...cors, 'content-type': 'application/json' } });
    }

    const contentText = htmlToText(vote.content);
    const deadline = vote.deadline ? new Date(vote.deadline).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
    const subject = `[한국인공지능개발자 협동조합] 새 투표 안건 안내 — ${vote.title}`;
    const body = [
      `안녕하세요, 한국인공지능개발자 협동조합입니다.`,
      ``,
      `새로운 투표 안건이 등록되었습니다. 정회원께서는 아래 내용을 확인하시고 투표에 참여해 주세요.`,
      ``,
      `■ 안건: ${vote.title}`,
      `■ 마감: ${deadline}`,
      ``,
      `■ 내용`,
      contentText || '(내용 없음)',
      ``,
      `▶ 투표하러 가기: ${VOTE_URL}`,
      `  (로그인 후 상단 ‘투표’ 메뉴에서도 참여하실 수 있습니다.)`,
      ``,
      `감사합니다.`,
      `— 한국인공지능개발자 협동조합`,
    ].join('\n');

    // 개인정보 보호를 위해 수신자는 BCC 로 발송
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [caller.email], bcc: emails, subject, text: body }),
    });
    const out = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, recipients: emails.length, out }), { headers: { ...cors, 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { ...cors, 'content-type': 'application/json' } });
  }
});
