// 'jobsMgmt' 네임스페이스 — 내 공고 관리 / 내 지원 관리 페이지 정적 UI 라벨(한국어 원문).
export default {
  jobsMgmt: {
    // 공통 상태 라벨
    statusNew: '신규',
    statusNewPending: '검토 대기',
    statusReviewing: '검토 중',
    statusAccepted: '합격',
    statusRejected: '불합격',

    // 로그인 안내
    loginRequiredTitle: '로그인이 필요합니다',
    myJobsLoginLead: '내 공고와 지원 현황은 로그인 후 확인할 수 있습니다.',
    myAppsLoginLead: '스크랩한 공고와 지원 현황은 로그인 후 확인할 수 있습니다.',

    // MyJobsPage
    myJobsTitle: '내 공고 관리',
    myJobsLead: '내가 등록한 공고와 지원자 현황을 확인하고 처리 상태를 관리합니다.',
    loading: '불러오는 중...',
    noJobs: '등록한 공고가 없습니다. 취업 페이지에서 공고를 등록해보세요.',
    closed: '🔒 CLOSED',
    open: '🟢 OPEN',
    deadlineLabel: '마감 기한 {date}',
    deadlinePassed: ' · ⚠️ 기한 경과(자동 삭제 대상)',
    contractorAssigned: '✅ 계약자 지정 완료',
    reopen: '🔓 재개시',
    close: '🔒 마감',
    applyCount: '지원 {count}건 ',
    platformOff: '이 공고는 ‘플랫폼 지원받기’가 꺼져 있습니다. 공고 수정에서 켜면 지원을 받을 수 있습니다.',
    noApplicants: '아직 지원자가 없습니다.',
    viewApplicantProfile: '지원자 프로필 보기',
    applicantFallback: '지원자',
    message: '✉️ 메시지',
    contractorBadge: '🏆 계약자',
    assignContractor: '🏆 계약자 지정 & 마감',

    // MyJobsPage — alert / confirm
    assignConfirm: '{name}님을 계약자로 지정하고 공고를 마감하시겠습니까?\n마감 후에는 더 이상 지원을 받지 않습니다.',
    assignConfirmFallbackName: '이 지원자',
    closeConfirm: '이 공고를 마감하시겠습니까?\n목록에는 마감으로 표시되며, 마감 1개월 후 자동 삭제됩니다.\n수정에서 다시 재개시할 수 있습니다.',
    statusErr: '상태 변경 오류: {msg}',
    closeErr: '마감 오류: {msg}',
    messageErr: '메시지 오류: {msg}',

    // MyApplicationsPage
    myAppsTitle: '내 지원 관리',
    myAppsLead: '스크랩한 공고와 내가 지원한 현황을 확인합니다.',
    tabScraps: '스크랩한 공고 ({count})',
    tabApplications: '지원 현황 ({count})',
    noScraps: '스크랩한 공고가 없습니다. 취업 페이지에서 🏷️ 버튼으로 공고를 스크랩해보세요.',
    noApplications: '지원한 공고가 없습니다.',
    closedShort: '🔒 마감',
    scrapDate: '스크랩 {date}',
    applyDate: '지원 {date}',
    delete: '🗑️ 삭제',

    // MyApplicationsPage — alert / confirm
    removeScrapConfirm: '스크랩을 삭제하시겠습니까?',
    deleteErr: '삭제 오류: {msg}',
  },
};
