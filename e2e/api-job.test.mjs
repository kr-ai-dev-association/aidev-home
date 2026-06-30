// API 레벨 e2e: 사용자 access token 으로 실제 Supabase(PostgREST, RLS)에 채용공고 생성→조회→삭제.
//   실행: ACCESS_TOKEN="<jwt>" [VIEW_USER_ID="<uuid>"] node e2e/api-job.test.mjs
//   .env 의 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 를 사용 (realtime 없이 fetch 로 호출).
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const URL_ = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const ANON = env.VITE_SUPABASE_ANON_KEY;
const TOKEN = process.env.ACCESS_TOKEN;
if (!URL_ || !ANON) { console.error('❌ .env 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 없습니다.'); process.exit(1); }
if (!TOKEN) { console.error('❌ ACCESS_TOKEN 환경변수가 필요합니다.'); process.exit(1); }

const H = { apikey: ANON, Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
const rest = (path, opt = {}) => fetch(`${URL_}/rest/v1/${path}`, { ...opt, headers: { ...H, ...(opt.headers || {}) } });

const STAMP = Date.now();
const TITLE = `E2E 채용공고 ${STAMP}`;
const COMPANY = `E2E 테스트 회사 ${STAMP}`;
let pass = 0, fail = 0, jobId = null;
const ok = (m) => { console.log(`✅ ${m}`); pass++; };
const no = (m) => { console.log(`❌ ${m}`); fail++; };

try {
  // 1) 토큰 → 사용자 확인
  const ur = await fetch(`${URL_}/auth/v1/user`, { headers: H });
  if (!ur.ok) { no(`토큰으로 사용자 조회 실패: HTTP ${ur.status}`); process.exit(1); }
  const u = await ur.json();
  const uid = u.id;
  ok(`로그인 사용자 확인: ${u.email || uid}`);

  // 2) 프로필(이름·코인·권한) 조회
  const pr = await rest(`profiles?id=eq.${uid}&select=name,coins,is_admin,account_type`);
  const prof = (await pr.json())[0] || {};
  console.log(`   프로필: name=${prof.name} · coins=${prof.coins} · admin=${prof.is_admin} · type=${prof.account_type}`);
  const authorName = prof.name || (u.email ? u.email.split('@')[0] : 'E2E');

  // 3) 채용공고 insert (실제 RLS + 코인 차감 트리거 통과 검증)
  const payload = {
    board_type: '채용공고', title: TITLE,
    description: '<p>E2E 자동 생성 채용공고 상세 설명입니다.</p>',
    contact: null, details: { company: COMPANY, employment_type: '정규직' },
    platform_apply: false, deadline: null,
    author_id: uid, author_name: authorName,
  };
  const ir = await rest('jobs', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
  if (!ir.ok) { no(`채용공고 insert 실패(RLS/코인/컬럼): HTTP ${ir.status} ${await ir.text()}`); process.exit(1); }
  const ins = (await ir.json())[0];
  jobId = ins.id;
  ok(`채용공고 생성됨: id=${jobId}`);

  // 4) 조회 + 필드 검증
  const gr = await rest(`jobs?id=eq.${jobId}&select=*`);
  const got = (await gr.json())[0];
  if (!got) no('생성 공고 조회 실패');
  else {
    got.board_type === '채용공고' ? ok('board_type = 채용공고') : no(`board_type 불일치: ${got.board_type}`);
    got.title === TITLE ? ok('title 일치') : no('title 불일치');
    got.author_id === uid ? ok('author_id = 본인') : no('author_id 불일치');
    got.details?.company === COMPANY ? ok('details.company 일치') : no('details.company 불일치');
    got.closed === false ? ok('closed=false (채용공고는 마감 개념 없음)') : no(`closed 예상밖: ${got.closed}`);
  }

  // 5) 목록 노출 확인
  const lr = await rest(`jobs?board_type=eq.${encodeURIComponent('채용공고')}&id=eq.${jobId}&select=id`);
  const list = await lr.json();
  (Array.isArray(list) && list.length === 1) ? ok('채용공고 목록에 노출 확인') : no('목록 노출 확인 실패');

  // 6) (지원자 프로필 페이지 라이브 조회 경로) 다른 회원 프로필을 id로 조회 가능한가
  if (process.env.VIEW_USER_ID) {
    const or = await rest(`profiles?id=eq.${process.env.VIEW_USER_ID}&select=id,name,main_title,skills,projects`);
    if (!or.ok) no(`타 회원 프로필 조회 실패(RLS): HTTP ${or.status} — 폴백 스냅샷으로 동작`);
    else {
      const other = (await or.json())[0];
      if (!other) no('타 회원 프로필 비공개(RLS) — 지원자 프로필 페이지는 폴백 스냅샷으로 동작');
      else ok(`타 회원 프로필 id 조회 성공: ${other.name} (projects ${Array.isArray(other.projects) ? other.projects.length : 0}건) — 라이브 프로필 페이지 동작 확인`);
    }
  }
} catch (e) {
  no(`예외: ${e.message}`);
} finally {
  // 7) 정리: 생성한 테스트 공고 삭제
  if (jobId) {
    const dr = await rest(`jobs?id=eq.${jobId}`, { method: 'DELETE', headers: { Prefer: 'return=representation' } });
    if (!dr.ok) no(`정리(삭제) 실패 — 수동 삭제 필요 id=${jobId}: HTTP ${dr.status}`);
    else {
      const cr = await rest(`jobs?id=eq.${jobId}&select=id`);
      const chk = await cr.json();
      (!chk || chk.length === 0) ? ok('정리 완료: 테스트 공고 삭제됨') : no('삭제 후에도 잔존');
    }
  }
  console.log(`\n결과: ${pass} 통과 / ${fail} 실패`);
  process.exit(fail ? 1 : 0);
}
