// Single resolver for locale-specific quiz data. Components and helpers
// import from this module — never directly from questions.ts / questions.en.ts
// or archetypes.ts / archetypes.en.ts. The build-time LOCALE constant lets
// Next.js tree-shake the unused language module out of the production bundle.

import { LOCALE } from '@/lib/i18n/locale';
import * as zhQuestions from './questions';
import * as enQuestions from './questions.en';
import * as zhArchetypes from './archetypes';
import * as enArchetypes from './archetypes.en';

export type { Trait, Question, QuestionOption } from './questions';
export type { Archetype } from './archetypes';

const q = LOCALE === 'en' ? enQuestions : zhQuestions;
const a = LOCALE === 'en' ? enArchetypes : zhArchetypes;

export const traits = q.traits;
export const dimensions = q.dimensions;
export const questions = q.questions;

export const dominantProfiles = a.dominantProfiles;
export const pairArchetypes = a.pairArchetypes;
export const fallback = a.fallback;
export const validResultImages = a.validResultImages;
export const FALLBACK_IMAGE = a.FALLBACK_IMAGE;
