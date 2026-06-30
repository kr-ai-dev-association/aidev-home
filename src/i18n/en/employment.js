// Employment namespace — English translation
export default {
  employment: {
    // EmploymentPage — card / badge / scrap
    scrapOn: 'Remove bookmark',
    scrap: 'Bookmark',
    statusClosed: '🔒 CLOSED',
    statusOpen: '🟢 OPEN',
    statusDeadline: '🔒 Closed',

    // EmploymentPage — alerts/confirms
    alertScrapLogin: 'Bookmarking is available after logging in.',
    alertScrapError: 'Bookmark error: {message}',
    alertJobDetailLogin: 'You must log in to view job details.',
    alertPostLogin: 'Log in to post a listing.',
    confirmDelete: 'Delete this listing?',
    alertDeleteError: 'Delete error: {message}',
    alertOutsourceCloseBlocked: 'Outsourcing projects are closed by designating a contractor among applicants in “My Postings”.\nTo end without a contract, please delete the listing.',
    confirmClose: 'Close this listing?\nIt will remain shown as closed in the list, and job/project recruitment posts are auto-deleted 1 month after closing.\nYou can reopen it by editing the period.',
    alertStatusError: 'Status change error: {message}',

    // EmploymentPage — fee banner
    feeBadge: '0% brokerage fee',
    feeHeadline: 'Fee-free matching for members',
    feeBody: 'The cooperative charges <strong>no brokerage fee whatsoever</strong> for <strong>hiring, project recruitment, and outsourcing</strong> between members. All platform features are funded by <strong>member dues</strong> and the <strong>cooperative’s revenue businesses</strong>.',

    // EmploymentPage — tabs/search/list
    tabAll: 'All',
    myJobs: 'My Postings ({count})',
    newJob: '+ Post a listing',
    searchPlaceholder: 'Keyword (Enter for full search)',
    searchAria: 'Search',
    loading: 'Loading...',
    emptyManage: 'You have no listings.',
    emptyList: 'No listings yet. Be the first to post!',
    recentJobs: 'Recent listings',
    noJobs: 'No listings',

    // JobForm — title/notice
    formEditTitle: 'Edit listing',
    formNewTitle: 'New listing',
    noticeTitle: '📋 Outsourcing project review & dispute handling',
    noticeItem1: 'Project completion is judged based on the <strong>“functional requirements” you register</strong>.',
    noticeItem2: 'If a dispute arises between client, performer, and members, the <strong>cooperative evaluation team</strong> will <strong>run the source code directly</strong> and verify every feature with an <strong>end-to-end (E2E) test</strong> in the same environment as the user.',
    noticeItem3: 'For a fair review, please be sure to upload <strong>detailed functional requirements, prototypes, and screenshots</strong>.',

    // JobForm — field labels/placeholders
    fieldBoard: 'Category',
    hintCorpOnly: 'Only approved corporate members can post hiring and project recruitment listings.',
    fieldTitle: 'Title',
    titlePlaceholder: 'Enter a title',
    fieldDescription: 'Project / detailed description',
    descriptionPlaceholder: 'Enter a description',
    selectPlaceholder: 'Select',
    listPlaceholder: 'One per line',
    tagsPlaceholder: 'Comma-separated (e.g. React, Python)',
    emailPlaceholder: 'name@example.com',
    phonePlaceholder: '010-0000-0000',

    // JobForm — validation messages
    errRequired: 'This field is required.',
    errEmail: 'Invalid email format.',
    errPhone: 'Use only digits, +, -, spaces, and ().',
    errUrl: 'Enter a URL starting with http(s)://.',
    errContact: 'Enter an email or an http(s) link.',
    errFeaturesRequired: 'Outsourcing projects require at least one detailed functional requirement (feature name and detailed description).',

    // JobForm — functional requirements
    featuresHint: 'Outsourcing projects can only be posted with concrete functional requirements. (At least one feature name + detailed description)',
    featureLabel: 'Feature {n}',
    delete: 'Delete',
    featureNamePlaceholder: 'Feature name',
    featureDetailLabel: 'Detailed description (Markdown)',
    featureDetailPlaceholder: '## Overview\n- Goal:\n- Key features:\n\n### Detailed requirements\n1. ...\n2. ...\n\n### Acceptance criteria (AC)\n- [ ] ...',
    featureImageAlt: 'Feature image',
    attachImage: 'Attach image',
    addFeature: '+ Add feature',

    // JobForm — attachments
    attachHint: 'Attach a proposal/spec (PDF), prototype source (ZIP), or GitHub repository link to support your functional requirements. Total size under 10MB.',
    attachKindPdf: '📄 PDF',
    attachKindZip: '🗜️ ZIP',
    attachKindLink: '🔗 LINK',
    addPdf: '📄 Add document (PDF)',
    addZip: '🗜️ Add source (ZIP)',
    addLink: '🔗 Add GitHub/link',
    promptLink: 'GitHub repository or document link (https://...)',
    attachUsed: 'Used {used} / 10MB',

    // JobForm — attachment validation alerts
    alertPdfOnly: 'Only PDF files can be attached.',
    alertZipOnly: 'Only ZIP files can be attached.',
    alertAttachSize: 'Total attachment size must be under 10MB.',
    alertLinkInvalid: 'Enter a link starting with http(s)://. (e.g. a GitHub repository)',
    alertImageUploadError: 'Image upload error: {message}',
    alertUploadError: 'Upload error: {message}',
    alertSaveError: 'Save error: {message}',

    // JobForm — screenshots
    screenshotAlt: 'Screenshot {n}',
    addImage: '+ Add image',

    // JobForm — contact/toggle/coin/actions
    fieldContact: 'External application/inquiry link (email or link, optional)',
    contactPlaceholder: 'e.g. hr@company.com or https://...',
    platformApplyTitle: 'Receive applications via the cooperative platform',
    platformApplyDesc: 'When enabled, an “Apply” button appears on the listing, and applicants’ application content and profiles are organized in “My Postings”. (Inquiry is always available.)',
    fieldDeadline: 'Deadline (date & time)',
    deadlineHint: '⚠️ Once the deadline passes, the listing is <strong>automatically deleted</strong>. Closing requires <strong>designating a contractor among applicants</strong> (“My Postings”); to extend, edit this listing and change the deadline.',
    coinHintOutsource: '🎁 Outsourcing projects earn <strong>100 coin</strong> on <strong>first registration (one time only)</strong>, and thereafter <strong>upon contract conclusion (closing)</strong>. (Balance: {coins} coin)',
    coinHintDefault: '💰 Posting a listing deducts <strong>10 coin</strong>. (Balance: {coins} coin)',
    cancel: 'Cancel',
    uploading: 'Uploading...',
    saving: 'Saving...',
    editDone: 'Save changes',
    submit: 'Post',

    // JobDetailPage — not found/back
    notFound: 'Job information not found.',
    backToList: 'Back to list',
    backToListArrow: '← Back to list',

    // JobDetailPage — restricted access
    restrictedTitle: 'Full-member only listing',
    restrictedDesc: 'Outsourcing project details can only be viewed by <strong>full members and admins</strong>.<br />Full-member access is granted by an admin.',

    // JobDetailPage — header/manage
    author: 'By: {name}',
    deadlineLabel: '⏳ Deadline: {date}{expired}',
    deadlineExpired: ' (past due)',
    scrapped: '🔖 Bookmarked',
    scrapToggle: '🏷️ Bookmark',
    messageAuthor: '✉️ Message the author',
    alertMessageError: 'Error starting message: {message}',
    closeOutsourceCancel: '🔓 Reopen',
    closeOutsource: '🏆 Close (designate contractor)',
    closeCancel: '🔓 Reopen',
    close: '🔒 Close',
    edit: 'Edit',

    // JobDetailPage — review notice
    detailNoticeTitle: '📋 Review & dispute handling',
    detailNoticeItem1: 'Completion is judged based on the <strong>“functional requirements” below</strong>.',
    detailNoticeItem2: 'In a dispute, the <strong>cooperative evaluation team</strong> runs the deliverable’s source code directly and verifies every feature with an <strong>E2E test</strong> in the same environment as the user.',

    // JobDetailPage — sections/apply
    sectionDescription: 'Detailed description',
    enlargeImage: 'Enlarge image',
    applyButton: '📝 Apply',
    inquiryButton: '✉️ Inquire (message the author)',
    externalApply: '🔗 External application/inquiry',

    // JobDetailPage — dispute/related/sidebar
    disputeTitle: 'Have a dispute?',
    disputeDesc: 'This is a contracted outsourcing project. If a dispute arises, you can request mediation from the cooperative’s dispute mediation committee with the button below.',
    disputeButton: '⚖️ Request dispute resolution',
    relatedTitle: 'Other listings in the same category',
    overview: 'Overview',
    overviewBoard: 'Category',
    overviewCompany: 'Company',
    overviewSubject: 'Entity',
    overviewInfo: 'Info',
    closeLightbox: 'Close',
    originalImageAlt: 'Original image',

    // ApplyModal
    modalClose: 'Close',
    applyDoneTitle: 'Your application has been received',
    applyDoneDesc: 'Your application and profile have been sent to the listing author. Please await the result.',
    confirm: 'OK',
    applyBadge: 'Apply',
    applyIntro: 'When you write your application, <strong>your profile</strong> (name, title, skills, contact, etc.) is sent along with it.',
    applyMessageLabel: 'Application / self-introduction ',
    applyMessagePlaceholder: 'Describe your motivation, relevant experience, available schedule, etc.',
    applyProfileNote: '👤 Profile sent: ',
    alertAlreadyApplied: 'You have already applied to this listing.',
    alertApplyError: 'Application error: {message}',
    submitting: 'Submitting...',
    submitApplication: 'Submit application',
  },
};
