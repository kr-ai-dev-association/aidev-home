// 'inbox','search','faqPage','footer','authPage','share' 네임스페이스 — 한국어 원문
export default {
  inbox: {
    title: '메시지함',
    tabNotifications: '알림',
    tabMessages: '메시지',
    markAll: '모두 읽음',
    deleteAll: '모두 삭제',
    notifEmpty: '알림이 없습니다.',
    notifSuffix: '님 · ',
    deleteNotifAria: '알림 삭제',
    convEmpty: '대화가 없습니다.',
    convEmptyHint: '게시글·공고 상세에서 작성자에게 메시지를 보낼 수 있습니다.',
    convDefaultLast: '대화를 시작하세요',
    threadEmpty: '대화를 선택하세요.',
    deleteConv: '대화 삭제',
    deleteMsgAria: '메시지 삭제',
    inputPlaceholder: '메시지를 입력하세요...',
    sendBtn: '전송',
    fallbackUser: '사용자',
    fallbackMe: '나',
    confirmDeleteNotif: '이 알림을 삭제하시겠습니까?',
    confirmDeleteAllNotifs: '모든 알림을 삭제하시겠습니까?',
    confirmDeleteMsg: '메시지를 삭제하시겠습니까?',
    confirmDeleteConv: '이 대화를 삭제하시겠습니까? 주고받은 메시지가 모두 삭제됩니다.',
    deleteError: '삭제 오류: {msg}',
    sendError: '전송 오류: {msg}',
    timeNow: '방금',
    timeMinutes: '{n}분 전',
    timeHours: '{n}시간 전',
    timeDays: '{n}일 전',
    timeMonths: '{n}개월 전',
  },
  search: {
    sourceJob: '취업',
    sourceCommunity: '커뮤니티',
    filterAll: '전체',
    filterJob: '취업',
    filterCommunity: '커뮤니티',
    placeholder: '취업·커뮤니티 통합 검색',
    goBtn: '검색',
    closeAria: '닫기',
    semanticTitle: '의미 유사도(코사인) 기반 검색',
    semanticLabel: '🧠 의미 검색',
    loading: '검색 중...',
    noResults: '검색 결과가 없습니다.',
    prompt: '키워드를 입력하고 Enter를 누르세요.',
  },
  faqPage: {
    eyebrow: 'PLATFORM FAQ · 자주 묻는 질문',
    heading: '플랫폼 사용법, 한눈에',
    lead: '한국인공지능개발자 협동조합 플랫폼의 가입·코인·커뮤니티·취업·투표·분쟁 조정 등 주요 기능을 질문과 답변으로 정리했습니다.',
    qPrefix: 'Q. ',
    aPrefix: 'A. ',
    ctaLead: '더 궁금한 점이 있으신가요?',
    ctaNotice: '공지사항 보기',
    ctaCommunity: '커뮤니티 질문하기',

    groupAccount: '🚀 가입 · 계정',
    groupCoin: '🪙 코인(Coin) 제도',
    groupCommunity: '💬 커뮤니티',
    groupJobs: '📢 취업 — 공고 · 지원 · 관리',
    groupDispute: '⚖️ 분쟁 조정 (외주 · 노동 · 계약)',
    groupVote: '🗳️ 투표 (정회원)',
    groupMessaging: '✉️ 메시지 · 알림 · 검색 · 공유',
    groupBiz: '🏢 사업 · 서비스 · B2B',

    accountQ1: '협동조합 플랫폼은 어떻게 가입하나요?',
    accountA1: 'Google 또는 GitHub 소셜 인증으로 가입합니다(별도 비밀번호 불필요). 이후 이름·연락처와 구분(개인/법인)을 입력하면 가입이 완료되고, 커뮤니티·취업·메시지 등 모든 기능을 이용할 수 있습니다.',
    accountQ2: '회원 등급은 어떻게 나뉘나요?',
    accountA2: '일반 회원(기본 기능)·정회원(관리자 부여 — 투표 참여, 외주 프로젝트 상세 열람)·법인 회원(가입 시 법인 선택, 관리자 승인 후 채용공고·프로젝트 구인 등록 가능)·관리자(회원 승인·권한 부여, 공지 작성, B2B·분쟁 처리)로 구분됩니다.',

    coinQ1: '코인은 어떻게 적립·차감되나요?',
    coinA1: '활동에 따라 코인이 변동됩니다. 정회원 최초 승인 +1,000, 커뮤니티 글 작성 +1, 답글 작성 +0.1, 채용공고·프로젝트 구인 등록 −10, 외주 프로젝트는 첫 등록(최초 1회) 또는 이후 계약 체결(마감) 시 +100, 분쟁 조정 의뢰 −1,000. 보유 코인은 헤더의 🪙 아이콘과 내 프로필에서 확인할 수 있습니다.',
    coinQ2: '코인은 어떻게 충전하나요?',
    coinA2: '코인은 1,000 coin 단위로 충전할 수 있습니다. 충전을 원하시면 관리자에게 메시지로 신청해 주세요. 결제(회비·충전) 확인 후 관리자가 코인을 적립해 드립니다.',

    communityQ1: '커뮤니티에 글은 어떻게 쓰나요?',
    communityA1: '제목·카테고리·태그를 지정해 작성하며, 이미지·유튜브를 삽입할 수 있는 리치 에디터를 제공합니다. 답글로 토론할 수 있고, 도배 방지를 위해 글은 10분·답글은 15초 간격 제한이 있습니다. 작성자 본인과 관리자는 삭제할 수 있습니다.',

    jobsQ1: '어떤 유형의 공고를 올릴 수 있나요?',
    jobsA1: '채용공고·프로젝트 구인(법인 회원)·외주 프로젝트가 있습니다. 유형별로 구조화된 입력을 지원합니다 — 프로젝트 구인은 월 급여, 외주 프로젝트는 선금·잔금으로 보수를 표기하고, 문서·소스 첨부(PDF·ZIP·GitHub 링크)와 스크린샷을 함께 등록할 수 있습니다.',
    jobsQ2: '공고에 지원하거나 문의하려면?',
    jobsA2: '공고에서 지원하기(지원서와 내 프로필 전달)와 문의하기(작성자에게 1:1 메시지)를 사용할 수 있습니다. 외부 링크 지원도 병행됩니다. 마음에 드는 공고는 스크랩(북마크)해 두고 내 지원 관리 → 스크랩 탭에서 모아볼 수 있습니다.',
    jobsQ3: '내가 올린 공고와 지원 현황은 어디서 관리하나요?',
    jobsA3: '프로필 메뉴의 내 공고 관리에서 공고별 지원자·지원 내용·처리 상태(검토중/합격 등)를 관리합니다. 지원자 이름을 클릭하면 지원자 프로필 페이지로 바로 이동합니다. 내가 지원한 공고와 스크랩은 내 지원 관리에서 확인합니다.',
    jobsQ4: '공고 마감은 어떻게 되나요?',
    jobsA4: '외주 프로젝트는 지원자 중 계약자를 지정하면 마감되며, 마감 기한이 지나도록 계약이 체결되지 않으면 자동 삭제됩니다. 채용공고·프로젝트 구인은 작성자가 직접 마감·재개시할 수 있고, 마감 1개월 경과 후 자동 삭제됩니다.',

    disputeQ1: '외주 프로젝트에서 분쟁이 생기면 어떻게 하나요?',
    disputeA1: '계약이 체결된 외주의 의뢰자 또는 수행자가 분쟁을 접수하면, 공고와 기능 요구사항 스냅샷이 함께 관리자에게 전달됩니다. 조합 평가팀이 결과물을 사용자와 동일한 환경에서 E2E 테스트로 검증해 조정합니다. 완료 여부는 공고의 기능 요구사항을 기준으로 판단합니다.',
    disputeQ2: '노동·프리랜서·자영업 분쟁도 조정받을 수 있나요?',
    disputeA2: '네. 임금 체불·부당해고·노동 환경·산업재해·불법 파견·위장도급(다단계 비정규직)·불공정 계약·기술 탈취·지식재산권 분쟁을 프로필 메뉴의 ‘분쟁 조정 의뢰’에서 신청할 수 있습니다(의뢰 시 1,000 coin 차감). 조합이 변호사·변리사·전문가를 배정해 단계별로 조정하며, 접수부터 해결까지 각 단계가 알림과 이메일로 전달됩니다. 자세한 안내는 상단 사업·서비스 → 분쟁 조정 페이지를 참고하세요.',
    disputeQ3: '분쟁 조정 진행 상황은 어디서 확인하나요?',
    disputeA3: '프로필 메뉴의 ‘분쟁 조정 의뢰 → 나의 조정 현황’ 탭에서 신청한 의뢰와 진행 단계(접수 → 검토 → 전문가 배정 → 조정 진행 → 해결)를 타임라인으로 확인할 수 있습니다. 단계가 갱신될 때마다 알림과 이메일로도 안내됩니다.',
    disputeQ4: '위장도급(다단계 비정규직)이 무엇인가요?',
    disputeA4: '실제 업무는 정규직과 같은데(상시 출퇴근, 명확한 업무 지시, 매일·주간 업무 보고 등) 중간 인력 파견 업체를 끼워 비정규직·프리랜서로 계약하게 하여 임금·복지에서 차별하는 구조입니다. 이에 해당한다면 위장도급일 수 있으며, 조합이 법적 검토와 조정을 지원합니다.',

    voteQ1: '투표 기능은 누가, 어떻게 사용하나요?',
    voteA1: '투표는 정회원 전용 메뉴입니다. 수퍼관리자가 안건을 등록하면 찬성/반대/기권을 1인 1표로 행사하며, 투표율·표수는 익명 인포그래픽으로 표시됩니다. 마감 시 결과가 자동으로 공지됩니다.',

    messagingQ1: '메시지함과 알림은 어떻게 동작하나요?',
    messagingA1: '알림(답글·공지·지원·분쟁)과 1:1 메시지를 한곳에서 확인합니다. 안 읽은 항목은 배지로 표시되며, 알림은 개별 또는 전체 삭제할 수 있습니다.',
    messagingQ2: '검색과 공유 기능은?',
    messagingA2: '취업·커뮤니티 통합 검색을 키워드 + 의미 기반으로 지원합니다. 글·공고는 X·Facebook·LinkedIn·Reddit으로 공유할 수 있고, 카카오톡·슬랙에 링크를 붙여넣으면 썸네일 미리보기가 표시됩니다.',

    bizQ1: '조합의 사업·서비스와 B2B 의뢰는 무엇인가요?',
    bizA1: '에이전트 구축(검증된 조합원에게 프로젝트 의뢰)·에이전트 평가(Prototypebench)·에이전트 하네스·분쟁 조정(노동·계약·외주)을 제공합니다. 각 소개는 상단 사업·서비스 메뉴에서 확인할 수 있습니다. 기업·조합원은 B2B 의뢰로 견적 문의·평가 신청을 접수할 수 있으며, 관리자가 처리 상태를 관리합니다.',
  },
  footer: {
    orgName: '한국인공지능개발자 협동조합',
    address: '주소 : 서울시 강남구 삼성로 86길 16 덕산빌딩 5층',
    email: '이메일 : tonymustbegreat@gmail.com',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
  },
  authPage: {
    loginTitle: '로그인',
    loginDesc: '소셜 계정으로 로그인하세요.',
    loginVerb: '로그인',
    noAccount: '계정이 없으신가요?',
    goSignup: '회원가입',

    signupTitle: '회원가입',
    signupVerb: '회원가입',
    signupAuthDesc: '먼저 소셜 계정으로 인증해주세요.',
    haveAccount: '이미 계정이 있으신가요?',
    goLogin: '로그인',

    detailsTitle: '정보 입력',
    detailsDesc: '조합원 가입을 위해 아래 정보를 입력해주세요.',
    fieldType: '구분',
    typeIndividual: '개인',
    typeCorporate: '법인',
    fieldName: '이름',
    namePlaceholder: '이름을 입력하세요',
    fieldCategory: '세부 카테고리',
    categorySelect: '선택하세요',
    catStudent: '학생',
    catJobSeeker: '취업준비생',
    catFreelancer: '프리랜서',
    catEmployee: '직장인',
    catSelfEmployed: '자영업',
    fieldCompany: '회사명',
    companyPlaceholder: '회사명을 입력하세요',
    fieldPosition: '직책',
    positionPlaceholder: '예: 대표, 팀장, 매니저',
    fieldEmail: '이메일',
    emailPlaceholder: 'example@email.com',
    fieldPhone: '전화번호',
    phonePlaceholder: '010-0000-0000',
    fieldPrivacy: '개인정보 수집·이용 안내',
    consent: '위 개인정보 수집·이용에 동의합니다.',
    submitting: '처리 중...',
    submit: '회원가입',
    googleVerb: 'Google로 {verb}',
    githubVerb: 'GitHub로 {verb}',
    inAppTitle: '인앱 브라우저에서는 구글 로그인이 제한됩니다',
    inAppDesc: '카카오톡·인스타그램 등 앱 내부 브라우저에서는 보안 정책상 구글 로그인이 차단됩니다. 메뉴(⋮)에서 ‘다른 브라우저로 열기’(Chrome·Safari)를 선택해 다시 접속해 주세요.',
    inAppCopy: '🔗 주소 복사',
    inAppCopied: '✓ 복사됨 — 브라우저에 붙여넣기',
    authError: '인증 오류: {msg}',
    saveError: '가입 정보 저장 오류: {msg}',
    privacyText: `[개인정보 수집·이용 동의]

한국인공지능개발자 협동조합(이하 "조합")은 「개인정보 보호법」 제15조 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라 아래와 같이 개인정보를 수집·이용합니다.

1. 수집·이용 목적
 - 조합원 가입 및 자격 확인, 본인 식별
 - 조합 서비스 제공 및 가입 관련 안내·고지사항 전달
 - 문의 응대 및 민원 처리

2. 수집 항목
 - (공통) 구분, 이름, 이메일, 전화번호
 - (개인) 세부 카테고리 / (법인) 회사명, 직책

3. 보유 및 이용 기간
 - 회원 탈퇴 시 또는 수집·이용 목적 달성 시까지 보유하며, 이후 지체 없이 파기합니다.
 - 다만 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.

4. 제3자 제공 및 마케팅 이용 금지
 - 조합은 정보주체의 별도 동의 없이 개인정보를 제3자에게 제공하지 않으며, 광고성 정보 전송 등 마케팅 목적으로 이용하지 않습니다.

5. 안전성 확보 조치
 - 수집된 개인정보는 암호화하여 저장·관리하며, 관계 법령이 정한 기술적·관리적 보호조치를 적용합니다.

6. 동의 거부 권리 및 불이익
 - 귀하는 본 동의를 거부할 권리가 있습니다. 다만 필수 항목 수집에 동의하지 않으실 경우 조합원 가입이 제한될 수 있습니다.

그 밖의 사항은 「개인정보 보호법」 및 「정보통신망법」 등 관련 법령과 조합의 개인정보 처리방침에 따릅니다.`,
  },
  share: {
    button: '🔗 공유',
    copied: '복사됨!',
    copyLink: '링크 복사',
    nativeShare: '기기로 공유 (카카오톡 등)',
    shareTo: '{target}에 공유',
    note: '슬랙·카카오톡은 링크를 붙여넣으면 썸네일이 표시됩니다.',
    copyPrompt: '아래 링크를 복사하세요',
    targetX: 'X (트위터)',
    targetFb: 'Facebook',
    targetLi: 'LinkedIn',
    targetRd: 'Reddit',
    targetKakao: '카카오톡',
    targetSlack: '슬랙',
    targetInsta: 'Instagram',
    unfurlGuide: '링크가 복사되었습니다. {target} 대화창에 붙여넣으면 썸네일 미리보기가 표시됩니다.',
    instaGuide: '링크가 복사되었습니다. Instagram은 게시물 내 링크 미리보기를 지원하지 않아, 프로필·스토리에 활용하세요.',
  },
};
