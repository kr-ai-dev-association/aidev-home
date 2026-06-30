// 모범예시 '팀 구인' 공고의 보수 항목을 월 급여 500만원으로 수정 (선금/잔금 제거).
//   실행: ACCESS_TOKEN="<admin jwt>" node e2e/update-sample-job.mjs
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const URL_ = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const ANON = env.VITE_SUPABASE_ANON_KEY;
const TOKEN = process.env.ACCESS_TOKEN;
if (!URL_ || !ANON || !TOKEN) { console.error('❌ .env(URL/ANON) 와 ACCESS_TOKEN 필요'); process.exit(1); }
const H = { apikey: ANON, Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
const rest = (p, o = {}) => fetch(`${URL_}/rest/v1/${p}`, { ...o, headers: { ...H, ...(o.headers || {}) } });

// 1) 대상 공고 찾기: 프로젝트 구인 + 제목에 '하네스 구축' 포함
const fr = await rest(`jobs?board_type=eq.${encodeURIComponent('프로젝트 구인')}&title=ilike.*${encodeURIComponent('하네스 구축')}*&select=id,title,details`);
if (!fr.ok) { console.error(`❌ 조회 실패: HTTP ${fr.status} ${await fr.text()}`); process.exit(1); }
const found = await fr.json();
if (!found.length) { console.error('❌ 대상 공고를 찾지 못했습니다 (프로젝트 구인 · 제목 "하네스 구축").'); process.exit(1); }
if (found.length > 1) console.log(`⚠️ ${found.length}건 매칭 — 모두 수정합니다.`);

for (const job of found) {
  const d = { ...(job.details || {}) };
  delete d.payment_advance;   // 선금 제거
  delete d.payment_balance;   // 잔금 제거
  d.monthly_salary = '500만원'; // 월 급여
  const ur = await rest(`jobs?id=eq.${job.id}`, {
    method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ details: d }),
  });
  if (!ur.ok) { console.error(`❌ 수정 실패 (${job.title}): HTTP ${ur.status} ${await ur.text()}`); process.exit(1); }
  const updated = (await ur.json())[0];
  console.log(`✅ 수정 완료: ${updated.title}`);
  console.log(`   월 급여 = ${updated.details?.monthly_salary} · 선금/잔금 제거됨(advance=${updated.details?.payment_advance ?? '없음'}, balance=${updated.details?.payment_balance ?? '없음'})`);
}
console.log('\n완료.');
