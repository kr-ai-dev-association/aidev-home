// 분쟁 조정 진행 안내 이메일 (Supabase Edge Function)
//   배포: supabase functions deploy mediation-email
//   시크릿: RESEND_API_KEY (dispute-email 과 공유)
//   호출: 의뢰 접수 시(의뢰자 본인) / 단계 진행 시(관리자)
//   ※ 미배포/도메인 미검증 시에도 인앱 알림은 트리거·RPC로 발송됩니다.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FROM = '한국인공지능개발자 협동조합 <no-reply@prototypebench.org>';

Deno.serve(async (req) => {
  try {
    const { mediation_id } = await req.json();
    if (!mediation_id) return new Response('mediation_id required', { status: 400 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 호출자 검증: 관리자 또는 의뢰자 본인
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: u } = await admin.auth.getUser(jwt);
    const caller = u?.user;
    if (!caller) return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });

    const { data: m } = await admin.from('mediations').select('*').eq('id', mediation_id).single();
    if (!m) return new Response('not found', { status: 404 });

    const { data: cp } = await admin.from('profiles').select('is_admin, email').eq('id', caller.id).single();
    const isAdmin = !!cp?.is_admin || caller.email === 'tony@banya.ai';
    if (!isAdmin && caller.id !== m.requester_id) {
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }

    // 의뢰자 이메일
    const { data: rp } = await admin.from('profiles').select('email, name').eq('id', m.requester_id).single();
    const to = rp?.email;

    // 최신 단계
    const { data: stepsArr } = await admin.from('mediation_steps').select('*').eq('mediation_id', mediation_id).order('step_no', { ascending: false }).limit(1);
    const latest = (stepsArr || [])[0];

    const statusLabel: Record<string, string> = {
      submitted: '접수', reviewing: '검토 중', assigned: '전문가 배정', in_progress: '조정 진행', resolved: '해결', closed: '종결',
    };

    const subject = `[한국인공지능개발자 협동조합] 분쟁 조정 「${m.title}」 진행 안내`;
    const lines = [
      `안녕하세요, ${rp?.name || ''}님. 한국인공지능개발자 협동조합 분쟁조정위원회입니다.`,
      ``,
      `회원님의 분쟁 조정 의뢰 「${m.title}」 진행 상황을 안내드립니다.`,
      `· 분쟁 유형: ${m.category}`,
      `· 현재 상태: ${statusLabel[m.status] || m.status}`,
    ];
    if (latest) {
      lines.push(`· 최근 단계: ${latest.title}`);
      if (latest.note) lines.push(`· 안내: ${latest.note}`);
    } else {
      lines.push(``, `의뢰가 정상 접수되었습니다. 조합이 검토 후 변호사·변리사·전문가를 배정해 단계별로 조정을 진행합니다.`);
    }
    if (Array.isArray(m.assignees) && m.assignees.length) {
      lines.push(``, `배정 전문가: ${m.assignees.map((a: any) => `${a.role} ${a.name}`).join(', ')}`);
    }
    lines.push(``, `진행 경과는 플랫폼 ‘나의 조정 현황’과 이메일로 안내드립니다. 감사합니다.`, ``, `— 한국인공지능개발자 협동조합 분쟁조정위원회`);
    const body = lines.join('\n');

    if (!RESEND_API_KEY || !to) {
      return new Response(JSON.stringify({ ok: false, reason: 'no RESEND_API_KEY or no recipient', to }), { headers: { 'content-type': 'application/json' } });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to], subject, text: body }),
    });
    const out = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, out }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
});
