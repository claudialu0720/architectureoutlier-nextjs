import 'server-only';
import { eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { db } from './db/client';
import { tokens, type Token } from './db/schema';
import { calculateScores, resolveResult } from './quiz/score';
import { questions } from './quiz/questions';

const alphabet =
  '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const generateId = customAlphabet(alphabet, 16);

export async function getToken(id: string): Promise<Token | null> {
  if (!id) return null;
  const row = await db.select().from(tokens).where(eq(tokens.id, id)).get();
  return row ?? null;
}

type CreateOpts = {
  orderId?: string | null;
  label?: string | null;
};

export async function createToken(opts: CreateOpts = {}): Promise<Token> {
  const id = generateId();
  const row: Token = {
    id,
    orderId: opts.orderId ?? null,
    label: opts.label ?? null,
    state: 'created',
    email: null,
    emailSent: false,
    answers: null,
    scores: null,
    archetype: null,
    resultImage: null,
    shareImageCount: 0,
    createdAt: Date.now(),
    completedAt: null,
  };
  await db.insert(tokens).values(row);
  return row;
}

export async function createTokensBatch(
  count: number,
  label?: string | null,
): Promise<Token[]> {
  const rows: Token[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    rows.push({
      id: generateId(),
      orderId: null,
      label: label ?? null,
      state: 'created',
      email: null,
      emailSent: false,
      answers: null,
      scores: null,
      archetype: null,
      resultImage: null,
      shareImageCount: 0,
      createdAt: now,
      completedAt: null,
    });
  }
  await db.insert(tokens).values(rows);
  return rows;
}

export async function revokeToken(id: string): Promise<Token | null> {
  const existing = await getToken(id);
  if (!existing) return null;
  if (existing.state !== 'created') return existing;
  await db.update(tokens).set({ state: 'revoked' }).where(eq(tokens.id, id));
  return { ...existing, state: 'revoked' };
}

type SubmitInput = {
  tokenId: string;
  answers: Array<number | null>;
  email?: string | null;
};

export type SubmitResult =
  | { ok: true; token: Token }
  | { ok: false; error: 'not_found' | 'already_completed' | 'revoked' | 'invalid_answers' };

export async function submitAnswers(input: SubmitInput): Promise<SubmitResult> {
  const existing = await getToken(input.tokenId);
  if (!existing) return { ok: false, error: 'not_found' };
  if (existing.state === 'completed') return { ok: false, error: 'already_completed' };
  if (existing.state === 'revoked') return { ok: false, error: 'revoked' };

  if (
    !Array.isArray(input.answers) ||
    input.answers.length !== questions.length ||
    input.answers.some(
      (a, i) =>
        typeof a !== 'number' ||
        a < 0 ||
        a >= questions[i].options.length,
    )
  ) {
    return { ok: false, error: 'invalid_answers' };
  }

  const scores = calculateScores(input.answers);
  const result = resolveResult(scores);
  const now = Date.now();

  await db
    .update(tokens)
    .set({
      state: 'completed',
      answers: JSON.stringify(input.answers),
      scores: JSON.stringify(scores),
      archetype: result.archetypeKey,
      resultImage: result.resultImage,
      email: input.email ?? null,
      completedAt: now,
    })
    .where(eq(tokens.id, input.tokenId));

  const updated = await getToken(input.tokenId);
  return updated ? { ok: true, token: updated } : { ok: false, error: 'not_found' };
}

export function parseStoredScores(raw: string | null): Record<string, number> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseStoredAnswers(raw: string | null): Array<number | null> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
