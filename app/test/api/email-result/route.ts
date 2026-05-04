import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tokens } from '@/lib/db/schema';
import { getToken } from '@/lib/tokens';
import { getEmailEnabled } from '@/lib/settings';
import { resolveResult, type Scores } from '@/lib/quiz/score';
import { sendResultEmail } from '@/lib/email/send';
import { LOCALE } from '@/lib/i18n';
import fs from 'fs';
import path from 'path';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { token, email } = (body ?? {}) as { token?: unknown; email?: unknown };
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (typeof token !== 'string' || !EMAIL_RE.test(normalizedEmail)) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  if (!(await getEmailEnabled())) {
    return NextResponse.json({ error: 'email_disabled' }, { status: 403 });
  }

  const t = await getToken(token);
  if (!t) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (t.state !== 'completed' || !t.scores) {
    return NextResponse.json({ error: 'not_completed' }, { status: 409 });
  }

  let scores: Scores;
  try {
    scores = JSON.parse(t.scores);
  } catch {
    return NextResponse.json({ error: 'corrupt_scores' }, { status: 500 });
  }
  const result = resolveResult(scores);

  const outcome = await sendResultEmail(normalizedEmail, token, result, scores);

  try {
    const filePath = path.join(process.cwd(), 'collected_emails.txt');
    const line = [
      new Date().toISOString(),
      LOCALE,
      result.archetypeKey,
      normalizedEmail,
    ].join(' | ');
    await fs.promises.appendFile(filePath, `${line}\n`);
  } catch (err) {
    console.error('Failed to append email to file', err);
  }

  await db
    .update(tokens)
    .set({ email: normalizedEmail, emailSent: outcome === 'sent' || outcome === 'logged' })
    .where(eq(tokens.id, token));

  return NextResponse.json({ outcome });
}
