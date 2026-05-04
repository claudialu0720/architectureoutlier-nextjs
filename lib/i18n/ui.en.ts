// English UI strings. The single source of truth for any user-facing text
// outside of the quiz/archetype data. Mirrored 1:1 by ui.zh.ts — keep keys,
// order and shape identical so a side-by-side diff stays trivial to review.

export const ui = {
  meta: {
    title: 'Architect Career Transition Test',
  },

  gate: {
    title: 'Architect Career Transition Test',
    inviteOnly: 'Invite-only access — please use the personal link you received.',
    getInviteCta: 'Get the test on RED',
    inviteUrl:
      'https://www.xiaohongshu.com/discovery/item/69f0a0b5000000003502a7e7?source=webshare&xhsshare=pc_web&xsec_token=ABbwaxICCPuPIDxpjyQFSydtkDgUsqFnTxpsTID_Q7rA8=&xsec_source=pc_share',
    invalidLink: 'Invalid link — this token does not exist.',
    revokedLink: 'This link has expired — please contact the sender.',
    missingResultData: 'Result data is missing — please contact the sender.',
  },

  start: {
    sectionLabel: '// Launch module',
    titleLine1: 'Beyond Architecture,',
    titleLine2: 'What Should You Do Next?',
    description:
      'Answer 30 intuitive questions to see how your skills are distributed — and discover career paths that may suit you better.',
    resume: 'Resume ->',
    restart: 'Restart -> ',
    start: 'Start test -> ',
    tip: '* Tip: Don’t overthink it. Your first instinct is usually the most accurate.',
  },

  question: {
    moduleLabels: ['// Module 1 / Preferences', '// Module 2 / Scenarios', '// Module 3 / Imagination'],
    completed: (percent: number) => `${percent}% completed`,
    parameter: 'PARAMETER',
    back: '<- Back',
    next: 'Continue ->',
    seeResult: 'See result ->',
  },

  analysis: {
    analyzing: 'ANALYZING…',
    generatingReport: 'GENERATING REPORT…',
  },

  submission: {
    submitting: 'SUBMITTING…',
    errorTitle: '// SUBMISSION ERROR',
    alreadyCompleted: 'This link has already been used. Refresh the page to view the saved result.',
    revoked: 'This link has been revoked.',
    notFound: 'Invalid token.',
    generic: 'Submission failed. Please try again later.',
    retry: '<- Retry',
  },

  result: {
    archetypeProfile: '// Archetype profile',
    careerSuggestions: '// Career transition suggestions',
    riskNote: '// Risk note',
    riskPrefix: 'Risk note:',
    oneLiner: '// result summary',
    sigil: '// Archetype sigil',
    sigilAlt: 'Archetype sigil',
    dimensions: '// Dimension analysis',
    saveShare: 'Save / Share',
    restart: '<- Restart',
    shareText: (name: string, summary: string) => `You are “${name}”: ${summary}`,
    copyText: (name: string, summaryFirstPerson: string, careers: string) =>
      `My result is “${name}”
${summaryFirstPerson}

Career transition paths that may suit me:
${careers}

You should try this too 👇
Search on RED: AO建外人
It should be the first post
Or visit
architectureoutlier.com/test`,
    // CN-only swap: rewrite the second-person summary into first person for
    // the copy/paste text. EN doesn't have a clean 1-character analog, so the
    // EN version returns the summary unchanged and frames the quote with
    // "My result:" instead.
    summaryToFirstPerson: (s: string) => s,
  },

  email: {
    title: '// Email me the result',
    unlockTitle: '// Unlock your full result',
    sentPrefix: '✓ Sent to',
    unlockedPrefix: 'Unlocked for',
    sending: 'SENDING…',
    send: 'SEND ->',
    unlockSend: 'UNLOCK ->',
    subject: (name: string) => `Your test result: ${name}`,
    htmlHeader: '// ARCHITECT CAREER TEST · RESULT',
    htmlCareerLabel: '// Career transition suggestions',
    htmlReportLabel: 'Full report &amp; radar chart:',
  },

  share: {
    title: '// Save / Share',
    closeAria: 'Close',
    generating: 'Generating...',
    limitReached: 'Generation limit reached — 10 times maximum',
    generationFailed: 'Generation failed. Please try again later.',
    networkError: 'Network error. Please try again later.',
    platformLeft: 'RED',
    platformLeftColor: '#ff2741',
    platformRight: 'WeChat',
    platformRightColor: '#1aad19',
    shareSave: 'Share / Save',
    saveImage: 'Save image',
    shareHint: 'Save to album / send to app',
    saveHint: 'Paste to RED / WeChat',
    copyText: 'Copy text',
    copied: 'Result copied',
  },

  poster: {
    header: '// ARCHITECT CAREER TEST  ·  ARCHITECT TYPE',
    archetype: '// My archetype',
    careers: '// Career paths that suit me',
    sigil: '// Archetype sigil',
    dimensions: '// Dimension analysis',
    cta: '// You should probably try this too',
    shareUrl: 'architectureoutlier.com/test',
    handleLine: 'Search on RED: AO建外人',
    showHandleLine: true,
  },

  // Used by score.ts when two traits tie for the secondary slot.
  tiedSecondaryAddendum: (secondaryText: string) =>
    ` Your secondary strengths are currently tied across ${secondaryText}. It may be better to position yourself around your dominant strength first, then use real-world practice to clarify your secondary axis.`,
};

