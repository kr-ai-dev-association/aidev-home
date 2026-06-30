// 분쟁 조정 개시 이메일 발송 (Supabase Edge Function)
//   배포: supabase functions deploy dispute-email
//   필요 시크릿: supabase secrets set RESEND_API_KEY=...  (Resend 사용)
//   호출: 관리자 프런트에서 supabase.functions.invoke('dispute-email', { body: { dispute_id } })
//   ※ 미배포 시에도 mediate_dispute RPC 가 인앱 알림을 발송하므로 핵심 통지는 동작합니다.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FROM = '한국인공지능개발자 협동조합 <no-reply@prototypebench.org>'; // 운영: prototypebench.org 도메인 검증 필요

Deno.serve(async (req) => {
  try {
    const { dispute_id, to_override } = await req.json(); // to_override: 테스트 단일 수신자(관리자 전용)
    if (!dispute_id) return new Response('dispute_id required', { status: 400 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 관리자만 호출 가능 — 호출자 JWT 검증
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
    const { data: cp } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single();
    if (!(cp?.is_admin || caller.email === 'tony@banya.ai')) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }

    const { data: d } = await admin.from('disputes').select('*').eq('id', dispute_id).single();
    if (!d) return new Response('not found', { status: 404 });

    // 당사자 이메일 조회
    const ids = [d.client_id, d.contractor_id].filter(Boolean);
    const { data: profs } = await admin.from('profiles').select('id,name,email').in('id', ids);
    const emails = to_override
      ? (Array.isArray(to_override) ? to_override : [to_override])
      : (profs || []).map((p: any) => p.email).filter(Boolean);

    const subject = `[한국인공지능개발자 협동조합] 외주 프로젝트 「${d.job_title ?? '프로젝트'}」 분쟁 조정 개시 안내`;
    const body = [
      `안녕하세요, 한국인공지능개발자 협동조합 분쟁조정위원회입니다.`,
      ``,
      `회원님이 당사자인 외주 프로젝트 「${d.job_title ?? '프로젝트'}」에 대한 분쟁 조정 절차가 개시되었습니다.`,
      ``,
      `조합은 IT·인공지능 전문가와 변호사로 구성된 조정단을 파견하여, 본 사건을 면밀히 조사·조정합니다.`,
      `조정은 다음에 근거하여 진행됩니다.`,
      `  · 공고의 내용`,
      `  · 등록된 기능 요구사항`,
      `  · 당사자 간 계약서`,
      ``,
      `진행 경과는 별도로 안내드리겠습니다. 감사합니다.`,
      ``,
      `— 한국인공지능개발자 협동조합 분쟁조정위원회`,
    ].join('\n');

    if (!RESEND_API_KEY || emails.length === 0) {
      return new Response(JSON.stringify({ ok: false, reason: 'no RESEND_API_KEY or no recipients', emails }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: emails, subject, text: body }),
    });
    const out = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, out }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
});
