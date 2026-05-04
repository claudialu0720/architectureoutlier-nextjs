import { LOCALE } from './locale';
import { ui as uiZh } from './ui.zh';
import { ui as uiEn } from './ui.en';

export { LOCALE, HTML_LANG, type Locale } from './locale';
export type { UiStrings } from './ui.zh';

// Build-time pick — Next.js inlines NEXT_PUBLIC_DEFAULT_LANG, so the
// unused branch is tree-shaken in production.
export const t = LOCALE === 'en' ? uiEn : uiZh;
