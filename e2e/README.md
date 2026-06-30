# E2E 테스트 (Playwright)

취업 채용공고 생성 플로우 e2e. 로그인이 **OAuth(소셜) 전용**이라 헤드리스 자동 로그인이 불가능하므로,
한 번 수동 로그인해 저장한 **인증 상태(storageState)** 를 재사용합니다.

> 채용공고·프로젝트 구인은 `CORP_ONLY` → **승인된 법인 회원 또는 관리자** 계정이어야 생성됩니다.

## 1) 설치 (최초 1회)

```bash
npm i -D @playwright/test
npx playwright install chromium
```

## 2) 인증 상태 저장 (최초 1회 / 만료 시 갱신)

브라우저가 열리면 **법인(승인) 또는 관리자 계정**으로 소셜 로그인한 뒤 창을 닫으세요.

```bash
npx playwright open --save-storage=e2e/.auth/user.json http://localhost:5173
```

> `e2e/.auth/` 는 비밀이 들어가므로 커밋하지 마세요. (`.gitignore` 에 추가 권장)

## 3) 실행

로컬 dev 서버를 자동 기동합니다.

```bash
npx playwright test
```

이미 떠 있는 서버나 프로덕션을 대상으로:

```bash
E2E_BASE_URL=https://aidev-home.vercel.app npx playwright test
```

## 검증 항목 (employment-job.spec.js)

- 법인 조합원이 **채용공고**를 생성 → 목록 노출
- 채용공고 카드/상세에 **OPEN/CLOSED 배지·마감(계약자 지정) 버튼이 없음** (외주 전용임을 확인)
