// 'jobsMgmt' namespace — English translations for My Jobs / My Applications pages.
export default {
  jobsMgmt: {
    // shared status labels
    statusNew: 'New',
    statusNewPending: 'Pending review',
    statusReviewing: 'Reviewing',
    statusAccepted: 'Accepted',
    statusRejected: 'Rejected',

    // login notice
    loginRequiredTitle: 'Login required',
    myJobsLoginLead: 'You can view your job posts and applicant status after logging in.',
    myAppsLoginLead: 'You can view your scrapped posts and application status after logging in.',

    // MyJobsPage
    myJobsTitle: 'My Job Posts',
    myJobsLead: 'Review the posts you created and applicant status, and manage their processing state.',
    loading: 'Loading...',
    noJobs: 'You have no job posts yet. Create one from the Employment page.',
    closed: '🔒 CLOSED',
    open: '🟢 OPEN',
    deadlineLabel: 'Deadline {date}',
    deadlinePassed: ' · ⚠️ Past deadline (eligible for auto-deletion)',
    contractorAssigned: '✅ Contractor assigned',
    reopen: '🔓 Reopen',
    close: '🔒 Close',
    applyCount: '{count} application(s) ',
    platformOff: 'This post has “Receive platform applications” turned off. Turn it on in Edit Post to receive applications.',
    noApplicants: 'No applicants yet.',
    viewApplicantProfile: 'View applicant profile',
    applicantFallback: 'Applicant',
    message: '✉️ Message',
    contractorBadge: '🏆 Contractor',
    assignContractor: '🏆 Assign contractor & close',

    // MyJobsPage — alert / confirm
    assignConfirm: 'Assign {name} as the contractor and close this post?\nNo further applications will be accepted after closing.',
    assignConfirmFallbackName: 'this applicant',
    closeConfirm: 'Close this post?\nIt will be marked as closed in the list and auto-deleted one month after closing.\nYou can reopen it from Edit.',
    statusErr: 'Status change error: {msg}',
    closeErr: 'Close error: {msg}',
    messageErr: 'Message error: {msg}',

    // MyApplicationsPage
    myAppsTitle: 'My Applications',
    myAppsLead: 'Review your scrapped posts and your application status.',
    tabScraps: 'Scrapped posts ({count})',
    tabApplications: 'Applications ({count})',
    noScraps: 'No scrapped posts yet. Scrap posts with the 🏷️ button on the Employment page.',
    noApplications: 'No applications yet.',
    closedShort: '🔒 Closed',
    scrapDate: 'Scrapped {date}',
    applyDate: 'Applied {date}',
    delete: '🗑️ Delete',

    // MyApplicationsPage — alert / confirm
    removeScrapConfirm: 'Remove this scrap?',
    deleteErr: 'Delete error: {msg}',
  },
};
