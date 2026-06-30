import { test, expect } from '@playwright/test';

// 조합원(승인된 법인 회원 또는 관리자) 계정으로 '채용공고'를 직접 생성하는 e2e.
//   · 채용공고/프로젝트 구인은 CORP_ONLY → 반드시 법인(승인) 또는 관리자 storageState 필요.
//   · 로그인은 OAuth 전용이므로 e2e/README.md 의 절차로 인증 상태를 먼저 저장하세요.
const STAMP = Date.now();
const TITLE = `E2E 채용공고 ${STAMP}`;
const COMPANY = `E2E 테스트 회사 ${STAMP}`;

test('법인 조합원이 채용공고를 생성하면 목록에 노출된다', async ({ page }) => {
  await page.goto('/employment');

  // 로그인 상태 확인 (storageState 미적용 시 가드)
  await expect(page.getByRole('button', { name: '+ 공고 등록' }), 'storageState 로그인 필요 — e2e/README.md 참고')
    .toBeVisible();

  // 공고 등록 폼 열기
  await page.getByRole('button', { name: '+ 공고 등록' }).click();
  await expect(page.getByText('공고 등록')).toBeVisible();

  // 구분: 채용공고 (board_type select)
  const boardSelect = page.locator('select').filter({ has: page.locator('option', { hasText: '채용공고' }) }).first();
  await boardSelect.selectOption('채용공고');

  // 제목
  await page.getByPlaceholder('제목을 입력하세요').fill(TITLE);

  // 상세 설명 (react-quill 에디터)
  const editor = page.locator('.ql-editor').first();
  await editor.click();
  await editor.type('E2E 자동 생성 채용공고 상세 설명입니다.');

  // 회사명 (필수) — .jf-field 안의 라벨 텍스트로 입력 칸 특정
  await page.locator('.jf-field', { hasText: '회사명' }).locator('input').fill(COMPANY);

  // 등록 (폼 submit 버튼)
  await page.locator('.job-form button[type="submit"]').click();

  // 목록으로 복귀 후 새 공고 노출 확인
  await expect(page.getByText(TITLE)).toBeVisible();

  // 채용공고에는 OPEN/CLOSED 상태 배지가 없어야 한다 (외주 전용)
  const card = page.locator('.job-card', { hasText: TITLE });
  await expect(card.locator('.job-status')).toHaveCount(0);
});

test('채용공고 상세에는 마감(계약자 지정) 버튼이 없다, 그리고 정리(삭제)', async ({ page }) => {
  await page.goto('/employment');
  await page.getByText(TITLE).first().click();
  // 상세 진입
  await expect(page.getByRole('heading', { name: TITLE })).toBeVisible();
  // 마감 관련 버튼 부재
  await expect(page.getByRole('button', { name: /마감/ })).toHaveCount(0);
  // 수정/삭제(작성자 관리)는 존재
  await expect(page.getByRole('button', { name: '수정' })).toBeVisible();

  // 정리: 생성한 테스트 공고 삭제 (실데이터 잔존 방지) — window.confirm 자동 수락
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', { name: '삭제' }).click();
  // 목록으로 복귀 후 제거 확인
  await expect(page.getByText(TITLE)).toHaveCount(0);
});
