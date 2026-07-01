// 'inbox','search','faqPage','footer','authPage','share' namespaces — English translations
export default {
  inbox: {
    title: 'Inbox',
    tabNotifications: 'Notifications',
    tabMessages: 'Messages',
    markAll: 'Mark all read',
    deleteAll: 'Delete all',
    notifEmpty: 'No notifications.',
    notifSuffix: ' · ',
    deleteNotifAria: 'Delete notification',
    convEmpty: 'No conversations.',
    convEmptyHint: 'You can message authors from post and listing detail pages.',
    convDefaultLast: 'Start a conversation',
    threadEmpty: 'Select a conversation.',
    deleteConv: 'Delete conversation',
    deleteMsgAria: 'Delete message',
    inputPlaceholder: 'Type a message...',
    sendBtn: 'Send',
    fallbackUser: 'User',
    fallbackMe: 'Me',
    confirmDeleteNotif: 'Delete this notification?',
    confirmDeleteAllNotifs: 'Delete all notifications?',
    confirmDeleteMsg: 'Delete this message?',
    confirmDeleteConv: 'Delete this conversation? All exchanged messages will be deleted.',
    deleteError: 'Delete error: {msg}',
    sendError: 'Send error: {msg}',
    timeNow: 'just now',
    timeMinutes: '{n}m ago',
    timeHours: '{n}h ago',
    timeDays: '{n}d ago',
    timeMonths: '{n}mo ago',
  },
  search: {
    sourceJob: 'Jobs',
    sourceCommunity: 'Community',
    filterAll: 'All',
    filterJob: 'Jobs',
    filterCommunity: 'Community',
    placeholder: 'Search jobs & community',
    goBtn: 'Search',
    closeAria: 'Close',
    semanticTitle: 'Semantic (cosine) similarity search',
    semanticLabel: '🧠 Semantic search',
    loading: 'Searching...',
    noResults: 'No results found.',
    prompt: 'Type a keyword and press Enter.',
  },
  faqPage: {
    eyebrow: 'PLATFORM FAQ · Frequently Asked Questions',
    heading: 'How to use the platform, at a glance',
    lead: 'We have organized the main features of the Korea AI Developers Cooperative platform — sign-up, coins, community, jobs, voting, dispute mediation, and more — into questions and answers.',
    qPrefix: 'Q. ',
    aPrefix: 'A. ',
    ctaLead: 'Have more questions?',
    ctaNotice: 'View announcements',
    ctaCommunity: 'Ask the community',

    groupAccount: '🚀 Sign-up · Account',
    groupCoin: '🪙 Coin System',
    groupCommunity: '💬 Community',
    groupJobs: '📢 Jobs — Listings · Applications · Management',
    groupDispute: '⚖️ Dispute Mediation (Outsourcing · Labor · Contracts)',
    groupVote: '🗳️ Voting (Full Members)',
    groupMessaging: '✉️ Messages · Notifications · Search · Sharing',
    groupBiz: '🏢 Business · Services · B2B',

    accountQ1: 'How do I join the cooperative platform?',
    accountA1: 'Sign up with Google or GitHub social authentication (no separate password needed). After entering your name, contact info, and type (individual/corporate), your registration is complete and you can use all features such as community, jobs, and messaging.',
    accountQ2: 'How are membership tiers divided?',
    accountA2: 'Members are divided into: general members (basic features), full members (granted by admin — voting participation, viewing outsourcing project details), corporate members (select corporate at sign-up; after admin approval can post job and project listings), and admins (member approval and permission granting, writing announcements, B2B and dispute handling).',

    coinQ1: 'How are coins earned and deducted?',
    coinA1: 'Coins change based on activity. First full-member approval +1,000, writing a community post +1, writing a reply +0.1, posting a job/project listing −10, outsourcing projects earn +100 on first registration (one time only) or later upon contract signing (closing), dispute mediation request −1,000. Your coin balance is shown in the header 🪙 icon and on your profile.',
    coinQ2: 'How do I top up coins?',
    coinA2: 'Coins can be topped up in units of 1,000 coin. To top up, please message an admin to request. After payment (dues/top-up) is confirmed, an admin will credit your coins.',

    communityQ1: 'How do I write a post in the community?',
    communityA1: 'You write by specifying a title, category, and tags, using a rich editor that lets you insert images and YouTube videos. You can discuss via replies, and to prevent spam there are intervals of 10 minutes for posts and 15 seconds for replies. The author and admins can delete posts.',

    jobsQ1: 'What types of listings can I post?',
    jobsA1: 'There are job postings, project recruitment (corporate members), and outsourcing projects. Each type supports structured input — project recruitment shows monthly salary, outsourcing projects show pay as down payment and balance, and you can attach documents/source (PDF/ZIP/GitHub links) and screenshots.',
    jobsQ2: 'How do I apply to or inquire about a listing?',
    jobsA2: 'On a listing you can use Apply (sends your application and profile) and Inquire (1:1 message to the author). External link applications are also supported. You can scrap (bookmark) listings you like and collect them under My Applications → Scraps tab.',
    jobsQ3: 'Where do I manage my listings and application status?',
    jobsA3: 'In My Job Listings under the profile menu, you manage applicants, application content, and processing status (under review / accepted, etc.) per listing. Clicking an applicant name goes directly to their profile page. Listings you applied to and scraps are found under My Applications.',
    jobsQ4: 'How do listings close?',
    jobsA4: 'Outsourcing projects close when a contractor is designated among applicants, and are auto-deleted if no contract is signed before the deadline. Job and project recruitment listings can be closed and reopened by the author directly, and are auto-deleted 1 month after closing.',

    disputeQ1: 'What do I do if a dispute arises in an outsourcing project?',
    disputeA1: 'When the client or contractor of a contracted outsourcing job files a dispute, the listing and a snapshot of the functional requirements are sent to the admin. The cooperative evaluation team verifies the deliverable via E2E testing in an environment identical to the user’s and mediates. Completion is judged based on the listing’s functional requirements.',
    disputeQ2: 'Can labor, freelancer, and self-employment disputes also be mediated?',
    disputeA2: 'Yes. You can file disputes over unpaid wages, unfair dismissal, working conditions, industrial accidents, illegal dispatch, disguised subcontracting (multi-tier non-regular employment), unfair contracts, technology theft, and intellectual property under ‘Dispute Mediation Request’ in the profile menu (1,000 coin deducted per request). The cooperative assigns lawyers, patent attorneys, and experts to mediate step by step, and each stage from intake to resolution is delivered via notification and email. For details, see the top Business · Services → Dispute Mediation page.',
    disputeQ3: 'Where can I check the progress of dispute mediation?',
    disputeA3: 'In the ‘Dispute Mediation Request → My Mediation Status’ tab of the profile menu, you can view your requests and progress stages (intake → review → expert assignment → mediation in progress → resolution) on a timeline. You are also notified by notification and email each time a stage is updated.',
    disputeQ4: 'What is disguised subcontracting (multi-tier non-regular employment)?',
    disputeA4: 'It is a structure where the actual work is the same as a regular employee (regular commuting, clear work instructions, daily/weekly work reports, etc.) but an intermediary staffing dispatch company is inserted so you are contracted as non-regular/freelance, leading to discrimination in wages and benefits. If this applies to you, it may be disguised subcontracting, and the cooperative supports legal review and mediation.',

    voteQ1: 'Who uses the voting feature, and how?',
    voteA1: 'Voting is a full-member-only menu. When a super admin registers an agenda, you cast a 1-person-1-vote for/against/abstain, and turnout and vote counts are shown as anonymous infographics. Results are announced automatically when voting closes.',

    messagingQ1: 'How do the inbox and notifications work?',
    messagingA1: 'You check notifications (replies, announcements, applications, disputes) and 1:1 messages in one place. Unread items are shown with a badge, and notifications can be deleted individually or all at once.',
    messagingQ2: 'What about search and sharing?',
    messagingA2: 'Unified jobs & community search is supported via keyword + semantic basis. Posts and listings can be shared to X, Facebook, LinkedIn, and Reddit, and pasting a link into KakaoTalk or Slack shows a thumbnail preview.',

    bizQ1: 'What are the cooperative’s business/services and B2B requests?',
    bizA1: 'We provide agent building (commissioning projects to verified members), agent evaluation (Prototypebench), agent harness, and dispute mediation (labor, contracts, outsourcing). Each introduction is available in the top Business · Services menu. Companies and members can submit quote inquiries and evaluation requests via B2B request, and admins manage processing status.',
  },
  footer: {
    orgName: 'Korea AI Developers Cooperative',
    address: 'Address: 5F Deoksan Bldg, 16 Samseong-ro 86-gil, Gangnam-gu, Seoul',
    email: 'Email: tonymustbegreat@gmail.com',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  authPage: {
    loginTitle: 'Log in',
    loginDesc: 'Log in with a social account.',
    loginVerb: 'Log in',
    noAccount: 'Don’t have an account?',
    goSignup: 'Sign up',

    signupTitle: 'Sign up',
    signupVerb: 'Sign up',
    signupAuthDesc: 'First, authenticate with a social account.',
    haveAccount: 'Already have an account?',
    goLogin: 'Log in',

    detailsTitle: 'Enter Details',
    detailsDesc: 'Please enter the information below to join the cooperative.',
    fieldType: 'Type',
    typeIndividual: 'Individual',
    typeCorporate: 'Corporate',
    fieldName: 'Name',
    namePlaceholder: 'Enter your name',
    fieldCategory: 'Category',
    categorySelect: 'Select',
    catStudent: 'Student',
    catJobSeeker: 'Job seeker',
    catFreelancer: 'Freelancer',
    catEmployee: 'Employee',
    catSelfEmployed: 'Self-employed',
    fieldCompany: 'Company name',
    companyPlaceholder: 'Enter your company name',
    fieldPosition: 'Position',
    positionPlaceholder: 'e.g. CEO, Team Lead, Manager',
    fieldEmail: 'Email',
    emailPlaceholder: 'example@email.com',
    fieldPhone: 'Phone',
    phonePlaceholder: '010-0000-0000',
    fieldPrivacy: 'Personal Information Collection & Use Notice',
    consent: 'I agree to the collection and use of personal information above.',
    submitting: 'Processing...',
    submit: 'Sign up',
    googleVerb: '{verb} with Google',
    githubVerb: '{verb} with GitHub',
    inAppTitle: 'Google sign-in is restricted in in-app browsers',
    inAppDesc: 'In-app browsers (KakaoTalk, Instagram, etc.) block Google sign-in for security reasons. Open this page in Chrome or Safari (menu ⋮ → Open in browser) and try again.',
    inAppCopy: '🔗 Copy link',
    inAppCopied: '✓ Copied — paste into your browser',
    authError: 'Authentication error: {msg}',
    saveError: 'Error saving registration info: {msg}',
    privacyText: `[Consent to Collection & Use of Personal Information]

The Korea AI Developers Cooperative (hereinafter "the Cooperative") collects and uses personal information as follows, in accordance with Article 15 of the Personal Information Protection Act and the Act on Promotion of Information and Communications Network Utilization and Information Protection.

1. Purpose of Collection & Use
 - Member registration and eligibility verification, identity confirmation
 - Provision of cooperative services and delivery of registration-related notices
 - Responding to inquiries and handling complaints

2. Items Collected
 - (Common) Type, name, email, phone number
 - (Individual) Detailed category / (Corporate) Company name, position

3. Retention & Use Period
 - Retained until membership withdrawal or until the purpose of collection/use is achieved, after which it is destroyed without delay.
 - However, where retention is required by relevant laws, it is kept for the applicable period.

4. Prohibition of Third-Party Provision & Marketing Use
 - The Cooperative does not provide personal information to third parties without the separate consent of the data subject, and does not use it for marketing purposes such as transmitting advertising information.

5. Security Measures
 - Collected personal information is encrypted for storage and management, and technical and administrative protection measures required by relevant laws are applied.

6. Right to Refuse Consent & Disadvantages
 - You have the right to refuse this consent. However, if you do not consent to the collection of required items, cooperative membership may be restricted.

Other matters follow the Personal Information Protection Act, the Network Act, and other relevant laws and the Cooperative’s privacy policy.`,
  },
  share: {
    button: '🔗 Share',
    copied: 'Copied!',
    copyLink: 'Copy link',
    nativeShare: 'Share to device (KakaoTalk, etc.)',
    shareTo: 'Share to {target}',
    note: 'Pasting the link into Slack or KakaoTalk shows a thumbnail.',
    copyPrompt: 'Copy the link below',
    targetX: 'X (Twitter)',
    targetFb: 'Facebook',
    targetLi: 'LinkedIn',
    targetRd: 'Reddit',
    targetKakao: 'KakaoTalk',
    targetSlack: 'Slack',
    targetInsta: 'Instagram',
    unfurlGuide: 'Link copied. Paste it into {target} to show a thumbnail preview.',
    instaGuide: 'Link copied. Instagram does not support link previews in posts — use it in your profile or story.',
  },
};
