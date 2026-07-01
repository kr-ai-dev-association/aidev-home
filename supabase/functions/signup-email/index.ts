// 회원가입 안내 이메일 (Supabase Edge Function)
//   배포: supabase functions deploy signup-email
//   호출: 가입 완료 직후 프런트에서 supabase.functions.invoke('signup-email', { body: { user_id } })
//   · 신규 회원 → 환영 메일
//   · 법인(승인 대기) → 관리자 그룹에 승인 대기 안내 메일

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FROM = '한국인공지능개발자 협동조합 <no-reply@prototypebench.org>';
const SITE = 'https://dev.prototypebench.org';

async function sendEmail(key: string, to: string[], subject: string, text: string, bcc?: string[]) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, bcc, subject, text }),
  });
  return { ok: res.ok, out: await res.json() };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { user_id } = await req.json();
    if (!user_id) return new Response('user_id required', { status: 400, headers: cors });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 호출자 검증 — 본인 또는 관리자
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: { ...cors, 'content-type': 'application/json' } });

    const { data: p } = await admin.from('profiles').select('id, name, email, account_type, company, position, approval_status').eq('id', user_id).single();
    if (!p) return new Response('not found', { status: 404, headers: cors });

    const { data: cp } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single();
    if (!(caller.id === user_id || cp?.is_admin || caller.email === 'tony@banya.ai')) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { ...cors, 'content-type': 'application/json' } });
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, reason: 'no RESEND_API_KEY' }), { headers: { ...cors, 'content-type': 'application/json' } });
    }

    const results: Record<string, unknown> = {};

    // 1) 신규 회원 환영 메일
    if (p.email) {
      const isCorp = p.account_type === 'corporate';
      const welcome = [
        `${p.name || ''}님, 한국인공지능개발자 협동조합 가입을 환영합니다! 🎉`,
        ``,
        `바이브코딩 생태계와 개발자 권익을 위한 통합 플랫폼입니다.`,
        `커뮤니티·취업 매칭·투표·분쟁 조정 등 다양한 기능을 이용하실 수 있습니다.`,
        ``,
        isCorp
          ? `※ 법인 회원은 관리자 승인 후 로그인 및 채용공고·프로젝트 구인 등록이 가능합니다. 승인 완료 시 별도 안내드리겠습니다.`
          : `지금 바로 플랫폼을 둘러보세요.`,
        ``,
        `▶ 플랫폼 바로가기: ${SITE}`,
        `▶ 이용 안내(필독): ${SITE}/community/topic/9f78e2b4-bdab-45f1-934f-cee989d7a9de`,
        ``,
        `감사합니다.`,
        `— 한국인공지능개발자 협동조합`,
      ].join('\n');
      results.welcome = await sendEmail(RESEND_API_KEY, [p.email], `[한국인공지능개발자 협동조합] 가입을 환영합니다`, welcome);
    }

    // 2) 법인(승인 대기) → 관리자에게 승인 대기 안내
    if (p.account_type === 'corporate' && (p.approval_status ?? 'pending') !== 'approved') {
      const { data: admins } = await admin.from('profiles').select('email').or('is_admin.eq.true,email.eq.tony@banya.ai');
      const adminEmails = [...new Set((admins || []).map((a: any) => a.email).filter(Boolean))];
      if (adminEmails.length) {
        const body = [
          `새 법인 회원 가입 신청이 접수되어 승인을 기다리고 있습니다.`,
          ``,
          `· 회사/기관: ${p.company || '-'}`,
          `· 담당자: ${p.name || '-'} (${p.position || '-'})`,
          `· 이메일: ${p.email || '-'}`,
          ``,
          `▶ 승인 처리: ${SITE}  (관리자 → 회원현황에서 승인)`,
          ``,
          `— 한국인공지능개발자 협동조합`,
        ].join('\n');
        results.adminNotify = await sendEmail(RESEND_API_KEY, adminEmails, `[조합] 새 법인 가입 승인 대기 — ${p.company || p.name}`, body);
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...cors, 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { ...cors, 'content-type': 'application/json' } });
  }
});
