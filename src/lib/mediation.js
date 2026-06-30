// 분쟁 조정 의뢰 공용 상수/헬퍼

export const REQUESTER_TYPES = ['노동자', '프리랜서', '자영업자'];

export const MEDIATION_CATEGORIES = [
  '임금 체불·미지급',
  '부당 해고',
  '노동 환경·처우',
  '산업재해',
  '불법 파견',
  '위장도급(다단계 비정규직)',
  '불공정 계약',
  '기술 탈취',
  '지식재산권 분쟁',
  '기타',
];

export const MEDIATION_STATUS = {
  submitted: { label: '접수', color: '#67e8f9', step: 1 },
  reviewing: { label: '검토 중', color: '#fcd34d', step: 2 },
  assigned: { label: '전문가 배정', color: '#a5b4fc', step: 3 },
  in_progress: { label: '조정 진행', color: '#fbbf24', step: 4 },
  resolved: { label: '해결', color: '#4ade80', step: 5 },
  closed: { label: '종결', color: '#94a3b8', step: 5 },
};

// 관리자 단계 진행용 — 다음 단계 후보(상태 + 기본 단계명)
export const MEDIATION_STAGE_ACTIONS = [
  { status: 'reviewing', title: '접수 검토 시작' },
  { status: 'assigned', title: '전문가(변호사·변리사) 배정' },
  { status: 'in_progress', title: '조정 절차 착수' },
  { status: 'resolved', title: '조정 성립·해결' },
  { status: 'closed', title: '의뢰 종결' },
];

export const ASSIGNEE_ROLES = ['변호사', '변리사', '전문가'];

export function medStatus(key) {
  return MEDIATION_STATUS[key] || MEDIATION_STATUS.submitted;
}

export function fmtDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
