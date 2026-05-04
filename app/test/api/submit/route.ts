import { NextResponse } from 'next/server';
import { submitAnswers } from '@/lib/tokens';
import { resolveResult, type Scores } from '@/lib/quiz/score';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { token, answers, email } = (body ?? {}) as {
    token?: unknown;
    answers?: unknown;
    email?: unknown;
  };

  if (typeof token !== 'string' || !Array.isArray(answers)) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const result = await submitAnswers({
    tokenId: token,
    answers: answers as Array<number | null>,
    email: typeof email === 'string' && email.length > 0 ? email : null,
  });

  if (!result.ok) {
    const status =
      result.error === 'not_found' || result.error === 'revoked'
        ? 404
        : result.error === 'already_completed'
          ? 409
          : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const scores = JSON.parse(result.token.scores ?? '{}') as Scores;
  const resolved = resolveResult(scores);

  return NextResponse.json({
    scores,
    result: resolved,
  });
}
