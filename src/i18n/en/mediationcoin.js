// 'mediation' / 'coin' namespace — English UI labels for the dispute mediation & coin charge pages.
// Note: DB identifier values (dispute categories/statuses/requester types/roles) live in lib/mediation.js and are not translated here.
export default {
  mediation: {
    // Login / permission notices
    loginRequiredTitle: 'Login required',
    loginRequiredLead: 'You can request dispute mediation after logging in as a member.',
    noPermissionTitle: 'Access denied',
    noPermissionLead: 'This page is available to administrators only.',

    // MediationPage — header
    title: 'Dispute Mediation Request',
    lead: 'For disputes in labor, freelance, and self-employed settings — unpaid wages, unfair dismissal, industrial accidents, illegal dispatch, disguised subcontracting, unfair contracts, technology theft, and intellectual property — the cooperative assigns <strong>lawyers, patent attorneys, and experts</strong> to mediate step by step.',

    // Tabs
    tabStatus: 'My Mediations ({count})',
    tabRequest: '+ New Mediation Request',

    // Form labels / placeholders
    fieldRequesterType: 'Requester type',
    fieldCategory: 'Dispute type',
    fieldCounterparty: 'Counterparty (company/institution)',
    counterpartyPlaceholder: 'e.g. OO Tech Inc. (optional)',
    fieldTitle: 'Title',
    titlePlaceholder: 'Summarize the dispute in one line',
    fieldContent: 'Dispute details',
    contentPlaceholder: 'Please describe in detail: how it occurred, the period, type of contract (full-time/contract/freelance/subcontract), actual working conditions (commuting, work instructions), and the damages incurred.',
    fieldDesired: 'Desired resolution',
    desiredPlaceholder: 'e.g. settlement of unpaid wages, reversal of unfair dismissal, conversion to full-time, damages, etc. (optional)',
    fieldEvidence: 'Evidence links',
    addLink: '+ Add document link',
    evidenceHint: 'Attaching links such as contracts, pay statements, work-instruction records, and messenger screenshots speeds up mediation.',
    requiredMark: '*',

    // Cost notice / submit
    costNotice: '⚠️ Submitting a dispute mediation request deducts <strong>1,000 coin</strong>. (For mediation panel operation and expert assignment.)',
    submitting: 'Submitting…',
    submit: 'Submit dispute mediation request (1,000 coin)',
    privacy: 'Submitted content is viewed only by the cooperative dispute mediation committee and the assigned lawyers, patent attorneys, and experts.',

    // Link prompts / alerts
    promptLinkUrl: 'Evidence link (contract, pay statement, employment contract, etc., https://...)',
    promptLinkName: 'Document name (e.g. Employment Contract)',
    submitErr: 'Request submission error: {msg}',
    submitSuccess: 'Your dispute mediation request has been received. You can check progress under "My Mediations".',

    // Status list
    loading: 'Loading...',
    noRequests: 'No dispute mediation requests yet. Submit one via "+ New Mediation Request".',
    counterpartyPrefix: 'Counterparty: {name} · ',
    requestedAt: 'Requested {date}',

    // Detail blocks
    blockContent: 'Request details',
    blockDesired: 'Desired resolution',
    blockAssignees: 'Assigned experts',
    blockSteps: 'Progress',
    noSteps: 'No progress steps yet. Your request is under review.',

    // Progress bar labels (display)
    stepSubmitted: 'Received',
    stepReviewing: 'Review',
    stepAssigned: 'Assigned',
    stepInProgress: 'Mediation',
    stepResolved: 'Resolved',

    // Admin page
    adminBack: '← Admin dashboard',
    adminTitle: 'Dispute Mediation Management',
    adminLead: 'Review labor and contract dispute mediation requests, assign lawyers, patent attorneys, and experts, and mediate step by step. In progress: {open} · Completed: {done}',
    adminNoRequests: 'No dispute mediation requests received.',
    counterpartySuffix: '· Counterparty: {name}',
    blockEvidence: 'Evidence',
    blockCurrentAssignment: 'Current assignment',
    blockHistory: 'Progress history',
    noHistory: 'No progress steps yet.',

    // Stage advancement input
    adminFormTitle: '⚖️ Advance stage + notify requester',
    selectStagePlaceholder: 'Select stage…',
    stageTitlePlaceholder: 'Stage name',
    adminNotePlaceholder: 'Note to send to the requester (optional)',
    advanceBtn: 'Advance stage + send notification & email',
    messageBtn: '✉️ Message the requester',

    // Admin alerts
    advanceValidation: 'Please enter the stage and stage name.',
    advanceErr: 'Processing error: {msg}',
    advanceSuccess: 'The progress step has been recorded and a notification has been sent to the requester.',
  },

  coin: {
    // Login notice
    loginRequiredTitle: 'Login required',
    loginRequiredLead: 'You can charge coins after logging in as a member.',

    // Header
    title: 'Charge Coins',
    lead: 'Charge as many coins as you need. Payments are securely processed through Lemon Squeezy.',

    // Balance
    balancePrefix: 'Balance',
    coinUnit: 'coin',

    // Product list
    loading: 'Loading...',
    noProducts: 'Charge products are being prepared. Please check back shortly.',
    buyBtn: 'Pay and charge',

    // Notes
    noteAutoApply: 'After payment, coins are <strong>usually applied automatically within a few seconds to a minute</strong>. If it is delayed, please refresh the page.',
    noteReceipt: 'Payments, refunds, and receipts are processed through Lemon Squeezy (payment provider), and a receipt is emailed upon payment.',
    noteUnitPrice: 'Rate: <strong>KRW 10,000 = 1,000 coin</strong>.',

    // Alerts
    loginToCharge: 'You can charge coins after logging in.',
    invalidCheckoutUrl: 'The payment link is invalid. Please contact an administrator.',
  },
};
