// Community area dictionary (CommunityPage / TopicDetailPage / MarkdownField)
export default {
  community: {
    // Relative time
    timeJustNow: 'just now',
    timeMinutesAgo: '{n}m ago',
    timeHoursAgo: '{n}h ago',
    timeDaysAgo: '{n}d ago',
    timeMonthsAgo: '{n}mo ago',
    timeYearsAgo: '{n}y ago',

    // Date / time display
    am: 'AM',
    pm: 'PM',
    dateTime: '{ampm} {h}:{min}, {mo}/{d}/{y}',

    // Default identifier (display)
    defaultAuthor: 'Anonymous',

    // alert / confirm
    alertLoginToView: 'You must be logged in to view topic details.',
    alertLoginToWrite: 'You must be logged in to create a new topic.',
    alertBotBlocked: 'Submission was blocked due to a suspicious request.',
    alertTooFast: 'Submitted too quickly. Please try again in a moment.',
    alertCaptchaWrong: 'The anti-bot answer is incorrect.',
    alertTopicCreateError: 'Topic creation error: {msg}',
    alertPostCreateError: 'Post creation error: {msg}',
    alertMessageStartError: 'Error starting message: {msg}',
    alertCommentCreateError: 'Reply submission error: {msg}',
    alertDeleteError: 'Delete error: {msg}',
    alertReplyCreateError: 'Reply submission error: {msg}',
    confirmDeleteComment: 'Delete this reply?',
    confirmDeleteTopic: 'Delete this topic? All posts and replies will be deleted as well.',
    confirmDeletePost: 'Delete this post? Its replies will be deleted as well.',

    // Header / tabs / search
    tabAllForums: 'All Forums',
    newTopic: '+ New Topic',
    searchPlaceholder: 'Search (Enter for unified search)',
    searchAria: 'Search',

    // New topic form
    newTopicTitle: 'Create New Topic',
    labelTitle: 'Title',
    placeholderTitle: 'Enter a title',
    labelCategory: 'Category',
    labelTags: 'Tags (comma separated)',
    placeholderTags: 'e.g. question, LLM',
    labelContent: 'Content',
    placeholderContent: 'Enter content',
    captchaLabel: 'Anti-bot — enter the answer to the following calculation:',
    captchaPlaceholder: 'Answer number',
    coinHintPrefix: '💰 You earn ',
    coinHintStrong: '1 coin',
    coinHintSuffix: ' for writing a post.',
    rateLimitHint: '⏱️ To prevent spam, you can post once every 10 minutes.',
    cancel: 'Cancel',
    submitting: 'Submitting...',
    submitTopic: 'Post Topic',

    // List columns / states
    colTopic: 'Topic',
    colPosts: 'Posts',
    colLastUpdated: 'Last Updated',
    loading: 'Loading...',
    emptySearch: 'No search results.',
    emptyNoTopics: 'No topics yet. Be the first to create one!',
    noticeBadge: '📢 Notice',
    metaStartedBy: 'Started by:',
    metaCategory: 'Category:',

    // Detail page
    notFound: 'Topic not found.',
    backToListings: 'Back to listings',
    breadcrumbCommunity: 'Community',
    tagsLabel: 'Tags:',
    statsLine: 'This topic has {posts} post(s) and {voices} participant(s); it was last updated {when} by {by}.',
    statsNone: '-',
    avatarAlt: '{name} avatar',
    roleAuthor: 'Author',
    roleParticipant: 'Participant',
    dmButton: '✉️ Message',
    deleteTopic: '🗑 Delete Topic',
    deletePost: '🗑 Delete Post',
    commentDeleteAria: 'Delete reply',
    commentPlaceholder: 'Add a reply... (earns 0.1 coin)',
    commentSubmit: 'Submit',
    replyTitle: 'Write a Reply',
    replyPlaceholder: 'Enter your reply...',
    backToList: 'Back to list',
    submitReply: 'Post Reply',
    loginToReply: 'You must be logged in to reply to this topic.',
    login: 'Log in',
    recentTopics: 'Recent Topics',
  },
};
