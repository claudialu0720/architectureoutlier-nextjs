// Chinese UI strings. The single source of truth for any user-facing text
// outside of the quiz/archetype data. Mirrored 1:1 by ui.en.ts — keep keys,
// order and shape identical so a side-by-side diff stays trivial to review.

export const ui = {
  meta: {
    title: '建筑师转型/转行测试',
  },

  gate: {
    title: '建筑师转型/转行测试',
    inviteOnly: '仅限邀请访问 — 请使用您收到的专属链接。',
    getInviteCta: '去小红书获取测试',
    inviteUrl:
      'https://www.xiaohongshu.com/discovery/item/69f0a0b5000000003502a7e7?source=webshare&xhsshare=pc_web&xsec_token=ABbwaxICCPuPIDxpjyQFSydtkDgUsqFnTxpsTID_Q7rA8=&xsec_source=pc_share',
    invalidLink: '链接无效 — 此令牌不存在。',
    revokedLink: '链接已失效 — 请联系发送方。',
    missingResultData: '结果数据缺失 — 请联系发送方。',
  },

  start: {
    sectionLabel: '// 启动模块',
    titleLine1: '在建筑之外',
    titleLine2: '你适合做什么？',
    description:
      '回答30个直觉问题，看看你的技能点分布，并获得更适合你的转型/转行方向。',
    resume: '继续上次 ->',
    restart: '重新开始 -> ',
    start: '开始测试 -> ',
    tip: '* 提示：不要想太久，第一反应通常最准。',
  },

  question: {
    moduleLabels: ['//模块1 / 偏好题', '//模块2 / 情景题', '//模块3 / 想象题'],
    completed: (percent: number) => `已完成 ${percent}%`,
    parameter: 'PARAMETER',
    back: '<- 返回',
    next: '继续 ->',
    seeResult: '查看结果 ->',
  },

  analysis: {
    analyzing: 'ANALYZING…',
    generatingReport: 'GENERATING REPORT…',
  },

  submission: {
    submitting: 'SUBMITTING…',
    errorTitle: '// SUBMISSION ERROR',
    alreadyCompleted: '该链接已使用。刷新页面查看已保存的结果。',
    revoked: '该链接已被撤销。',
    notFound: '令牌无效。',
    generic: '提交失败。请稍后重试。',
    retry: '<- 重试',
  },

  result: {
    archetypeProfile: '// 原型画像',
    careerSuggestions: '// 转型/转行方向建议',
    riskNote: '// 风险提示',
    riskPrefix: '风险提示：',
    oneLiner: '// 一句话结果',
    sigil: '// 原型徽记',
    sigilAlt: '原型徽记',
    dimensions: '// 维度分析',
    saveShare: '保存 / 分享',
    restart: '<- 重新开始',
    shareText: (name: string, summary: string) => `你是「${name}」：${summary}`,
    copyText: (name: string, summaryFirstPerson: string, careers: string) =>
      `我测出来的是「${name}」
${summaryFirstPerson}

适合我的转型/转行方向有：
${careers}

你也来测一下吧👇
小红书搜索：AO建外人
第一条笔记就是
或点击
architectureoutlier.com/test`,
    // CN-only swap: rewrite the second-person summary into first person for
    // the copy/paste text. EN doesn't have a clean 1-character analog, so the
    // EN version returns the summary unchanged and frames the quote with
    // "My result:" instead.
    summaryToFirstPerson: (s: string) => s.replace(/你/g, '我'),
  },

  email: {
    title: '// 把结果发到我的邮箱',
    unlockTitle: '// 把结果发到我的邮箱',
    sentPrefix: '✓ 已发送至',
    unlockedPrefix: '✓ 已发送至',
    sending: 'SENDING…',
    send: 'SEND ->',
    unlockSend: 'SEND ->',
    subject: (name: string) => `你的测试结果：${name}`,
    htmlHeader: '// ARCHITECT CAREER TEST · 测试结果',
    htmlCareerLabel: '// 转型方向建议',
    htmlReportLabel: 'Full report &amp; radar chart:',
  },

  share: {
    title: '// 保存 / 分享',
    closeAria: '关闭',
    generating: '生成中...',
    limitReached: '已达到生成次数上限（10 次）',
    generationFailed: '生成失败，请稍后重试',
    networkError: '网络错误，请稍后重试',
    platformLeft: 'RED',
    platformLeftColor: '#ff2741',
    platformRight: 'WeChat',
    platformRightColor: '#1aad19',
    shareSave: '分享 / 保存',
    saveImage: '保存图片',
    shareHint: '保存到相册 / 发送到 App',
    saveHint: '粘贴到小红书 / 微信',
    copyText: '复制文字',
    copied: '结果已复制',
  },

  poster: {
    header: '// 建筑师转型测试  ·  ARCHITECT TYPE',
    archetype: '// 我的原型',
    careers: '// 适合我的转型方向',
    sigil: '// 原型徽记',
    dimensions: '// 维度分析',
    cta: '// 你应该也挺适合测一下',
    shareUrl: 'architectureoutlier.com/test',
    handleLine: '小红书搜索：AO建外人',
    showHandleLine: true,
  },

  // Used by score.ts when two traits tie for the secondary slot.
  tiedSecondaryAddendum: (secondaryText: string) =>
    ` 你当前的次强维度并列出现在 ${secondaryText}，更适合先按主导优势做定位，再通过实践把副轴拉开。`,
};

export type UiStrings = typeof ui;
