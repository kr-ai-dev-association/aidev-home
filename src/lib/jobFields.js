// 취업 게시판: 카테고리(보드)별 입력/출력 필드 정의
export const BOARD_TYPES = ['채용공고', '프로젝트 구인', '외주 프로젝트'];

// 법인(또는 관리자)만 작성 가능한 보드
export const CORP_ONLY = ['채용공고', '프로젝트 구인'];

// 보드별 구조화 필드 (details jsonb에 저장)
// type: text | select | list(줄바꿈→배열) | tags(쉼표→배열) | features(이름+상세+이미지 반복) | images(스크린샷 복수)
export const FIELD_DEFS = {
  '채용공고': [
    { key: 'company', label: '회사명', type: 'text', required: true },
    { key: 'location', label: '근무지', type: 'text' },
    { key: 'employment_type', label: '고용 형태', type: 'select', options: ['정규직', '계약직', '인턴', '파견', '프리랜서'] },
    { key: 'salary', label: '급여', type: 'text' },
    { key: 'job_field', label: '직무 분야', type: 'text' },
    { key: 'responsibilities', label: '주요 업무', type: 'list' },
    { key: 'requirements', label: '자격 요건', type: 'list' },
  ],
  '프로젝트 구인': [
    { key: 'team', label: '팀/회사명', type: 'text', required: true },
    { key: 'roles', label: '모집 분야·인원', type: 'list' },
    { key: 'tech_stack', label: '기술 스택', type: 'tags' },
    { key: 'budget', label: '예산 (구체적 금액)', type: 'text' },
    { key: 'monthly_salary', label: '월 급여', type: 'text' },
    { key: 'duration', label: '기간', type: 'text' },
    { key: 'features', label: '기능 요구사항', type: 'features' },
    { key: 'attachments', label: '문서·소스 첨부 (PDF / ZIP / GitHub)', type: 'attachments' },
    { key: 'screenshots', label: '스크린샷', type: 'images' },
    { key: 'phone', label: '연락처 (전화번호)', type: 'text', validate: 'phone' },
    { key: 'email', label: '연락처 (이메일)', type: 'text', validate: 'email' },
  ],
  '외주 프로젝트': [
    { key: 'client', label: '의뢰처 (선택)', type: 'text' },
    { key: 'budget', label: '예산 (구체적 금액)', type: 'text', required: true },
    { key: 'payment_advance', label: '선금', type: 'text' },
    { key: 'payment_balance', label: '잔금', type: 'text' },
    { key: 'duration', label: '기간', type: 'text' },
    { key: 'work_mode', label: '진행 형태', type: 'select', options: ['원격', '상주', '혼합'] },
    { key: 'features', label: '기능 요구사항', type: 'features' },
    { key: 'attachments', label: '문서·소스 첨부 (PDF / ZIP / GitHub)', type: 'attachments' },
    { key: 'screenshots', label: '스크린샷', type: 'images' },
    { key: 'phone', label: '연락처 (전화번호)', type: 'text', validate: 'phone' },
    { key: 'email', label: '연락처 (이메일)', type: 'text', validate: 'email' },
  ],
};

// 고용 형태 배지 색상
const TYPE_STYLE = {
  '정규직': { bg: 'rgba(34,197,94,0.16)', color: '#4ade80' },
  '계약직': { bg: 'rgba(251,191,36,0.16)', color: '#fbbf24' },
  '인턴': { bg: 'rgba(34,211,238,0.16)', color: '#67e8f9' },
  '파견': { bg: 'rgba(248,113,113,0.16)', color: '#fca5a5' },
  '프리랜서': { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' },
};
const BOARD_STYLE = {
  '프로젝트 구인': { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' },
  '외주 프로젝트': { bg: 'rgba(34,211,238,0.16)', color: '#67e8f9' },
};

export function badgeStyle(label) {
  return TYPE_STYLE[label] || BOARD_STYLE[label] || { bg: 'rgba(255,255,255,0.08)', color: '#cbd5e1' };
}

// 목록 카드 표시 정보 (보드별로 다른 항목) — meta(추가 칩) / tech(기술 태그) 포함
export function cardInfo(job) {
  const d = job.details || {};
  if (job.board_type === '채용공고') {
    return {
      company: d.company,
      location: d.location,
      badge: d.employment_type || '채용공고',
      meta: [d.salary, d.job_field].filter(Boolean),
      tech: [],
    };
  }
  if (job.board_type === '프로젝트 구인') {
    return {
      company: d.team,
      location: [d.monthly_salary ? `월 ${d.monthly_salary}` : d.budget, d.duration].filter(Boolean).join(' · '),
      badge: '프로젝트 구인',
      meta: (Array.isArray(d.roles) ? d.roles.slice(0, 1) : []).filter(Boolean),
      tech: Array.isArray(d.tech_stack) ? d.tech_stack : [],
    };
  }
  return {
    company: d.client || '외주',
    location: [d.work_mode, d.budget, d.duration].filter(Boolean).join(' · '),
    badge: '외주 프로젝트',
    meta: [],
    tech: Array.isArray(d.tech_stack) ? d.tech_stack : [],
  };
}
