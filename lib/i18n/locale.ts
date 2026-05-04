// Build-time language switch. NEXT_PUBLIC_DEFAULT_LANG is inlined by Next at
// build time, so a deployment ships exactly one language. Default is Chinese.
export type Locale = 'zh' | 'en';

export const LOCALE: Locale =
  process.env.NEXT_PUBLIC_DEFAULT_LANG === 'en' ? 'en' : 'zh';

export const HTML_LANG = LOCALE === 'en' ? 'en' : 'zh-CN';
