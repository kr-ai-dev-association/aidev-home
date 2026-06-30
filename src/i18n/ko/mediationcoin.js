// 'mediation' / 'coin' 네임스페이스 — 분쟁 조정·코인 충전 페이지 정적 UI 라벨(한국어 원문).
// 주의: DB 저장·비교용 식별자(분쟁 유형/상태/의뢰자 구분/역할 등)는 lib/mediation.js 에서 관리하며 여기서 다루지 않음.
export default {
  mediation: {
    // 로그인/권한 안내
    loginRequiredTitle: '로그인이 필요합니다',
    loginRequiredLead: '분쟁 조정 의뢰는 조합원 로그인 후 이용할 수 있습니다.',
    noPermissionTitle: '접근 권한이 없습니다',
    noPermissionLead: '이 페이지는 관리자만 열람할 수 있습니다.',

    // MediationPage — 헤더
    title: '분쟁 조정 의뢰',
    lead: '노동·프리랜서·자영업 현장의 임금·해고·산재·불법파견·위장도급·불공정계약·기술탈취·지식재산권 분쟁을 조합이 <strong>변호사·변리사·전문가</strong>를 배정해 단계별로 조정합니다.',

    // 탭
    tabStatus: '나의 조정 현황 ({count})',
    tabRequest: '+ 새 조정 의뢰',

    // 폼 라벨/플레이스홀더
    fieldRequesterType: '의뢰자 구분',
    fieldCategory: '분쟁 유형',
    fieldCounterparty: '상대방(기업/기관)',
    counterpartyPlaceholder: '예: ○○테크 주식회사 (선택)',
    fieldTitle: '제목',
    titlePlaceholder: '분쟁을 한 줄로 요약',
    fieldContent: '분쟁 상세 내용',
    contentPlaceholder: '발생 경위, 기간, 계약 형태(정규직/계약직/프리랜서/도급), 실제 근무 형태(출퇴근·업무지시 여부), 피해 내용 등을 구체적으로 작성해 주세요.',
    fieldDesired: '희망 해결 방안',
    desiredPlaceholder: '예: 체불 임금 정산, 부당해고 철회, 정규직 전환, 손해배상 등 (선택)',
    fieldEvidence: '증빙 자료 링크',
    addLink: '+ 자료 링크 추가',
    evidenceHint: '계약서·임금명세서·업무지시 기록·메신저 캡처 링크 등을 첨부하면 조정이 빨라집니다.',
    requiredMark: '*',

    // 비용 안내/제출
    costNotice: '⚠️ 분쟁 조정 의뢰 시 <strong>1,000 coin</strong>이 차감됩니다. (조정단 운영·전문가 배정 비용)',
    submitting: '접수 중…',
    submit: '분쟁 조정 의뢰하기 (1,000 coin)',
    privacy: '제출된 내용은 조합 분쟁조정위원회와 배정된 변호사·변리사·전문가만 열람합니다.',

    // 링크 추가 prompt / alert
    promptLinkUrl: '증빙 자료 링크 (계약서·임금명세서·근로계약 등, https://...)',
    promptLinkName: '자료 이름 (예: 근로계약서)',
    submitErr: '의뢰 접수 오류: {msg}',
    submitSuccess: '분쟁 조정 의뢰가 접수되었습니다. 진행 상황은 ‘나의 조정 현황’에서 확인하실 수 있습니다.',

    // 현황 리스트
    loading: '불러오는 중...',
    noRequests: '의뢰한 분쟁 조정이 없습니다. ‘+ 새 조정 의뢰’에서 신청해보세요.',
    counterpartyPrefix: '상대: {name} · ',
    requestedAt: '의뢰 {date}',

    // 상세 블록
    blockContent: '의뢰 내용',
    blockDesired: '희망 해결 방안',
    blockAssignees: '배정 전문가',
    blockSteps: '진행 단계',
    noSteps: '아직 등록된 진행 단계가 없습니다. 접수 검토 중입니다.',

    // 진행 바 라벨(표시용)
    stepSubmitted: '접수',
    stepReviewing: '검토',
    stepAssigned: '배정',
    stepInProgress: '조정',
    stepResolved: '해결',

    // 관리자 페이지
    adminBack: '← 관리자 대시보드',
    adminTitle: '분쟁 조정 의뢰 관리',
    adminLead: '노동·계약 분쟁 조정 의뢰를 확인하고 변호사·변리사·전문가를 배정해 단계별로 조정합니다. 진행 중 {open}건 · 완료 {done}건',
    adminNoRequests: '접수된 분쟁 조정 의뢰가 없습니다.',
    counterpartySuffix: '· 상대: {name}',
    blockEvidence: '증빙 자료',
    blockCurrentAssignment: '현재 배정',
    blockHistory: '진행 이력',
    noHistory: '아직 진행 단계가 없습니다.',

    // 단계 진행 입력
    adminFormTitle: '⚖️ 단계 진행 + 의뢰자 알림',
    selectStagePlaceholder: '진행 단계 선택…',
    stageTitlePlaceholder: '단계명',
    adminNotePlaceholder: '의뢰자에게 전달할 안내(선택)',
    advanceBtn: '단계 진행 + 알림·이메일 발송',
    messageBtn: '✉️ 의뢰자에게 메시지',

    // 관리자 alert
    advanceValidation: '진행 단계와 단계명을 입력해 주세요.',
    advanceErr: '진행 처리 오류: {msg}',
    advanceSuccess: '진행 단계가 등록되고 의뢰자에게 알림이 발송되었습니다.',
  },

  coin: {
    // 로그인 안내
    loginRequiredTitle: '로그인이 필요합니다',
    loginRequiredLead: '코인 충전은 조합원 로그인 후 이용할 수 있습니다.',

    // 헤더
    title: '코인 충전',
    lead: '필요한 만큼 코인을 충전하세요. 결제는 Lemon Squeezy를 통해 안전하게 처리됩니다.',

    // 잔액
    balancePrefix: '보유 코인',
    coinUnit: 'coin',

    // 상품 리스트
    loading: '불러오는 중...',
    noProducts: '충전 상품을 준비 중입니다. 잠시 후 다시 확인해 주세요.',
    buyBtn: '결제하고 충전',

    // 안내문
    noteAutoApply: '결제 완료 후 코인은 <strong>보통 수 초~1분 내 자동 반영</strong>됩니다. 반영이 늦으면 페이지를 새로고침해 주세요.',
    noteReceipt: '결제·환불·영수증은 Lemon Squeezy(결제대행)를 통해 처리되며, 결제 시 이메일로 영수증이 발송됩니다.',
    noteUnitPrice: '충전 단가: <strong>10,000원 = 1,000 coin</strong> 기준입니다.',

    // alert
    loginToCharge: '충전은 로그인 후 이용할 수 있습니다.',
    invalidCheckoutUrl: '결제 링크가 올바르지 않습니다. 관리자에게 문의해 주세요.',
  },
};
