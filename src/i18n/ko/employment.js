// 취업(employment) 네임스페이스 — 한국어 원문
export default {
  employment: {
    // EmploymentPage — 카드 / 배지 / 스크랩
    scrapOn: '스크랩 해제',
    scrap: '스크랩',
    statusClosed: '🔒 CLOSED',
    statusOpen: '🟢 OPEN',
    statusDeadline: '🔒 마감',

    // EmploymentPage — 알림/확인
    alertScrapLogin: '스크랩은 로그인 후 이용할 수 있습니다.',
    alertScrapError: '스크랩 오류: {message}',
    alertJobDetailLogin: '로그인해야 채용 상세 정보를 볼 수 있습니다.',
    alertPostLogin: '로그인 후 공고를 등록할 수 있습니다.',
    confirmDelete: '이 공고를 삭제하시겠습니까?',
    alertDeleteError: '삭제 오류: {message}',
    alertOutsourceCloseBlocked: '외주 프로젝트는 ‘내 공고 관리’에서 지원자 중 계약자를 지정해야 마감됩니다.\n계약 없이 종료하려면 공고를 삭제해 주세요.',
    confirmClose: '이 공고를 마감하시겠습니까?\n목록에는 마감으로 계속 표시되며, 채용·프로젝트 구인은 마감 1개월 후 자동 삭제됩니다.\n기간을 수정하면 다시 재개시할 수 있습니다.',
    alertStatusError: '상태 변경 오류: {message}',

    // EmploymentPage — 수수료 배너
    feeBadge: '중계 수수료 0%',
    feeHeadline: '조합원을 위한, 수수료 없는 매칭',
    feeBody: '조합은 조합원 간의 <strong>채용·프로젝트 구인·외주 업무</strong>에 대해 <strong>어떠한 중계 수수료도 받지 않습니다.</strong> 모든 플랫폼 기능은 <strong>조합원의 회비</strong>와 <strong>조합의 수익 사업</strong>으로 운영됩니다.',

    // EmploymentPage — 탭/검색/목록
    tabAll: '전체',
    myJobs: '내 공고({count})',
    newJob: '+ 공고 등록',
    searchPlaceholder: '키워드 (Enter로 통합 검색)',
    searchAria: '검색',
    loading: '불러오는 중...',
    emptyManage: '등록한 공고가 없습니다.',
    emptyList: '등록된 공고가 없습니다. 첫 공고를 등록해보세요!',
    recentJobs: '최근 공고',
    noJobs: '공고 없음',

    // JobForm — 제목/안내
    formEditTitle: '공고 수정',
    formNewTitle: '공고 등록',
    noticeTitle: '📋 외주 프로젝트 검수·분쟁 처리 안내',
    noticeItem1: '프로젝트 완료 여부는 <strong>등록하신 ‘기능 요구사항’</strong>을 기준으로 판단합니다.',
    noticeItem2: '의뢰자·수행자·조합원 간 분쟁이 발생하면, <strong>조합 평가팀</strong>이 완성 결과물의 <strong>소스 코드를 직접 구동</strong>하여 사용자와 동일한 환경에서 <strong>E2E(End-to-End) 테스트</strong>로 모든 기능을 검증합니다.',
    noticeItem3: '공정한 검수를 위해 <strong>상세한 기능 요구사항·프로토타입·스크린샷</strong>을 반드시 업로드해 주세요.',

    // JobForm — 필드 라벨/플레이스홀더
    fieldBoard: '구분',
    hintCorpOnly: '채용공고·프로젝트 구인은 승인된 법인 회원만 등록할 수 있습니다.',
    fieldTitle: '제목',
    titlePlaceholder: '제목을 입력하세요',
    fieldDescription: '프로젝트/상세 설명',
    descriptionPlaceholder: '설명을 입력하세요',
    selectPlaceholder: '선택하세요',
    listPlaceholder: '한 줄에 하나씩 입력',
    tagsPlaceholder: '쉼표로 구분 (예: React, Python)',
    emailPlaceholder: 'name@example.com',
    phonePlaceholder: '010-0000-0000',

    // JobForm — 검증 메시지
    errRequired: '필수 항목입니다.',
    errEmail: '올바른 이메일 형식이 아닙니다.',
    errPhone: '숫자, +, -, 공백, () 만 사용해 입력하세요.',
    errUrl: 'http(s):// 로 시작하는 URL을 입력하세요.',
    errContact: '이메일 또는 http(s) 링크를 입력하세요.',
    errFeaturesRequired: '외주 프로젝트는 상세한 기능 요구사항(기능 이름과 상세 설명)을 1개 이상 입력해야 합니다.',

    // JobForm — 기능 요구사항
    featuresHint: '외주 프로젝트는 구체적인 기능 요구사항이 있어야 등록할 수 있습니다. (기능 이름 + 상세 설명 1개 이상)',
    featureLabel: '기능 {n}',
    delete: '삭제',
    featureNamePlaceholder: '기능 이름',
    featureDetailLabel: '상세 설명 (Markdown)',
    featureDetailPlaceholder: '## 개요\n- 목표:\n- 주요 기능:\n\n### 상세 요구사항\n1. ...\n2. ...\n\n### 완료 기준(AC)\n- [ ] ...',
    featureImageAlt: '기능 이미지',
    attachImage: '이미지 첨부',
    addFeature: '+ 기능 추가',

    // JobForm — 첨부
    attachHint: '기능 요구사항을 뒷받침할 기획서·명세서(PDF), 프로토타입 소스(ZIP), 또는 GitHub 저장소 링크를 첨부하세요. 통합 용량 10MB 미만.',
    attachKindPdf: '📄 PDF',
    attachKindZip: '🗜️ ZIP',
    attachKindLink: '🔗 LINK',
    addPdf: '📄 문서(PDF) 추가',
    addZip: '🗜️ 소스(ZIP) 추가',
    addLink: '🔗 GitHub/링크 추가',
    promptLink: 'GitHub 저장소 또는 문서 링크 (https://...)',
    attachUsed: '사용 {used} / 10MB',

    // JobForm — 첨부 검증 알림
    alertPdfOnly: 'PDF 파일만 첨부할 수 있습니다.',
    alertZipOnly: 'ZIP 파일만 첨부할 수 있습니다.',
    alertAttachSize: '첨부 파일 통합 용량은 10MB 미만이어야 합니다.',
    alertLinkInvalid: 'http(s):// 로 시작하는 링크를 입력하세요. (예: GitHub 저장소)',
    alertImageUploadError: '이미지 업로드 오류: {message}',
    alertUploadError: '업로드 오류: {message}',
    alertSaveError: '저장 오류: {message}',

    // JobForm — 스크린샷
    screenshotAlt: '스크린샷 {n}',
    addImage: '+ 이미지 추가',

    // JobForm — 연락처/토글/coin/액션
    fieldContact: '외부 지원/문의 링크 (이메일 또는 링크, 선택)',
    contactPlaceholder: '예: hr@company.com 또는 https://...',
    platformApplyTitle: '조합 플랫폼으로 지원받기',
    platformApplyDesc: '켜면 공고에 ‘지원하기’ 버튼이 표시되고, 지원자의 지원 내용·프로필이 ‘내 공고 관리’에 정리됩니다. (문의하기는 항상 제공)',
    fieldDeadline: '마감 기한 (날짜·시간)',
    deadlineHint: '⚠️ 마감 기한이 지나면 공고가 <strong>자동 삭제</strong>됩니다. 마감은 <strong>지원자 중 계약자를 지정</strong>해야 가능하며(‘내 공고 관리’), 연장하려면 이 공고를 수정해 기한을 변경하세요.',
    coinHintOutsource: '🎁 외주 프로젝트는 <strong>첫 등록 시(최초 1회)</strong>, 이후엔 <strong>계약 체결(마감) 시 100 coin</strong>이 적립됩니다. (보유: {coins} coin)',
    coinHintDefault: '💰 공고를 등록하면 <strong>10 coin</strong>이 차감됩니다. (보유: {coins} coin)',
    cancel: '취소',
    uploading: '업로드 중...',
    saving: '저장 중...',
    editDone: '수정 완료',
    submit: '등록',

    // JobDetailPage — 없음/뒤로
    notFound: '채용 정보를 찾을 수 없습니다.',
    backToList: '목록으로 돌아가기',
    backToListArrow: '← 목록으로 돌아가기',

    // JobDetailPage — 제한 열람
    restrictedTitle: '정회원 전용 공고',
    restrictedDesc: '외주 프로젝트의 상세 내용은 <strong>정회원·관리자</strong>만 열람할 수 있습니다.<br />정회원 권한은 관리자가 부여합니다.',

    // JobDetailPage — 헤더/관리
    author: '작성: {name}',
    deadlineLabel: '⏳ 마감 기한: {date}{expired}',
    deadlineExpired: ' (기한 경과)',
    scrapped: '🔖 스크랩됨',
    scrapToggle: '🏷️ 스크랩',
    messageAuthor: '✉️ 작성자에게 메시지',
    alertMessageError: '메시지 시작 오류: {message}',
    closeOutsourceCancel: '🔓 마감 취소',
    closeOutsource: '🏆 마감(계약자 지정)',
    closeCancel: '🔓 마감 취소(재개시)',
    close: '🔒 마감',
    edit: '수정',

    // JobDetailPage — 검수 안내
    detailNoticeTitle: '📋 검수·분쟁 처리 안내',
    detailNoticeItem1: '완료 여부는 <strong>아래 ‘기능 요구사항’</strong>을 기준으로 판단합니다.',
    detailNoticeItem2: '분쟁 시 <strong>조합 평가팀</strong>이 결과물 소스 코드를 직접 구동해 사용자와 동일한 환경에서 <strong>E2E 테스트</strong>로 모든 기능을 검증합니다.',

    // JobDetailPage — 섹션/지원
    sectionDescription: '상세 설명',
    enlargeImage: '이미지 크게 보기',
    applyButton: '📝 지원하기',
    inquiryButton: '✉️ 문의하기 (작성자에게 메시지)',
    externalApply: '🔗 외부 지원/문의',

    // JobDetailPage — 분쟁/관련/사이드바
    disputeTitle: '분쟁이 있으신가요?',
    disputeDesc: '계약이 체결된 외주 프로젝트입니다. 분쟁 발생 시 아래 버튼으로 조합 분쟁조정위원회에 조정을 요청할 수 있습니다.',
    disputeButton: '⚖️ 분쟁 해결 요청',
    relatedTitle: '같은 카테고리의 다른 공고',
    overview: '개요',
    overviewBoard: '구분',
    overviewCompany: '회사',
    overviewSubject: '주체',
    overviewInfo: '정보',
    closeLightbox: '닫기',
    originalImageAlt: '원본 이미지',

    // ApplyModal
    modalClose: '닫기',
    applyDoneTitle: '지원이 접수되었습니다',
    applyDoneDesc: '지원 내용과 프로필이 공고 작성자에게 전달되었습니다. 결과를 기다려 주세요.',
    confirm: '확인',
    applyBadge: '지원하기',
    applyIntro: '지원 내용을 작성하면 <strong>내 프로필</strong>(이름·타이틀·기술·연락처 등)이 함께 전달됩니다.',
    applyMessageLabel: '지원 내용 / 자기소개 ',
    applyMessagePlaceholder: '지원 동기, 관련 경험, 가능 일정 등을 적어주세요.',
    applyProfileNote: '👤 전달 프로필: ',
    alertAlreadyApplied: '이미 이 공고에 지원하셨습니다.',
    alertApplyError: '지원 오류: {message}',
    submitting: '제출 중...',
    submitApplication: '지원서 제출',
  },
};
