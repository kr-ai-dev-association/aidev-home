import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

// 로그인은 OAuth(소셜) 전용이라 헤드리스 자동 로그인이 불가능합니다.
// 한 번 수동 로그인해 저장한 인증 상태(storageState)를 재사용합니다. (e2e/README.md 참고)
const STORAGE = process.env.E2E_STORAGE_STATE || 'e2e/.auth/user.json';
const hasAuth = fs.existsSync(STORAGE);

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    headless: true,
    trace: 'on-first-retry',
    ...(hasAuth ? { storageState: STORAGE } : {}),
  },
  // E2E_BASE_URL 이 없으면 로컬 dev 서버를 자동 기동
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true, timeout: 60_000 },
});
