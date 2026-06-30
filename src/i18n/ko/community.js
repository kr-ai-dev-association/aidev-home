// 커뮤니티 영역 사전 (CommunityPage / TopicDetailPage / MarkdownField)
export default {
  community: {
    // 상대 시간
    timeJustNow: '방금 전',
    timeMinutesAgo: '{n}분 전',
    timeHoursAgo: '{n}시간 전',
    timeDaysAgo: '{n}일 전',
    timeMonthsAgo: '{n}개월 전',
    timeYearsAgo: '{n}년 전',

    // 날짜/시간 표시
    am: '오전',
    pm: '오후',
    dateTime: '{y}년 {mo}월 {d}일 {ampm} {h}:{min}',

    // 기본 식별자(표시용)
    defaultAuthor: '익명',

    // alert / confirm
    alertLoginToView: '로그인해야 토픽 상세 정보를 볼 수 있습니다.',
    alertLoginToWrite: '로그인해야 새 주제를 작성할 수 있습니다.',
    alertBotBlocked: '비정상적인 요청으로 작성이 차단되었습니다.',
    alertTooFast: '너무 빠르게 제출되었습니다. 잠시 후 다시 시도해주세요.',
    alertCaptchaWrong: '자동입력 방지 답이 올바르지 않습니다.',
    alertTopicCreateError: '주제 생성 오류: {msg}',
    alertPostCreateError: '게시글 생성 오류: {msg}',
    alertMessageStartError: '메시지 시작 오류: {msg}',
    alertCommentCreateError: '답글 등록 오류: {msg}',
    alertDeleteError: '삭제 오류: {msg}',
    alertReplyCreateError: '답변 등록 오류: {msg}',
    confirmDeleteComment: '답글을 삭제하시겠습니까?',
    confirmDeleteTopic: '이 주제를 삭제하시겠습니까? 모든 게시글과 답글이 함께 삭제됩니다.',
    confirmDeletePost: '이 게시글을 삭제하시겠습니까? 달린 답글도 함께 삭제됩니다.',

    // 헤더 / 탭 / 검색
    tabAllForums: '모든 포럼',
    newTopic: '+ 새 주제 작성',
    searchPlaceholder: '검색 (Enter로 통합 검색)',
    searchAria: '검색',

    // 새 주제 작성 폼
    newTopicTitle: '새 주제 작성',
    labelTitle: '제목',
    placeholderTitle: '제목을 입력하세요',
    labelCategory: '카테고리',
    labelTags: '태그 (쉼표 구분)',
    placeholderTags: '예: 질문, LLM',
    labelContent: '내용',
    placeholderContent: '내용을 입력하세요',
    captchaLabel: '자동입력 방지 — 다음 계산의 답을 입력하세요:',
    captchaPlaceholder: '정답 숫자',
    coinHintPrefix: '💰 글을 작성하면 ',
    coinHintStrong: '1 coin',
    coinHintSuffix: '이 적립됩니다.',
    rateLimitHint: '⏱️ 도배 방지를 위해 글은 10분에 1회 작성할 수 있습니다.',
    cancel: '취소',
    submitting: '등록 중...',
    submitTopic: '주제 등록',

    // 목록 컬럼/상태
    colTopic: '주제',
    colPosts: '게시글',
    colLastUpdated: '최근 업데이트',
    loading: '불러오는 중...',
    emptySearch: '검색 결과가 없습니다.',
    emptyNoTopics: '아직 등록된 주제가 없습니다. 첫 주제를 작성해보세요!',
    noticeBadge: '📢 공지',
    metaStartedBy: '시작:',
    metaCategory: '카테고리:',

    // 상세 페이지
    notFound: '토픽을 찾을 수 없습니다.',
    backToListings: '목록으로 돌아가기',
    breadcrumbCommunity: '커뮤니티',
    tagsLabel: '태그:',
    statsLine: '이 주제는 {posts}개의 게시글, {voices}명의 참여자가 있으며, 마지막 업데이트는 {when}에 {by}에 의해 이루어졌습니다.',
    statsNone: '-',
    avatarAlt: '{name} 아바타',
    roleAuthor: '작성자',
    roleParticipant: '참여자',
    dmButton: '✉️ 메시지',
    deleteTopic: '🗑 주제 삭제',
    deletePost: '🗑 게시글 삭제',
    commentDeleteAria: '답글 삭제',
    commentPlaceholder: '답글 달기... (작성 시 0.1 coin 적립)',
    commentSubmit: '등록',
    replyTitle: '답변 작성',
    replyPlaceholder: '답변을 입력하세요...',
    backToList: '목록으로',
    submitReply: '답변 등록',
    loginToReply: '이 주제에 답변하려면 로그인해야 합니다.',
    login: '로그인',
    recentTopics: '최근 주제',
  },
};
