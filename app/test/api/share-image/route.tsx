import { ImageResponse } from 'next/og';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tokens } from '@/lib/db/schema';
import { getToken, parseStoredScores } from '@/lib/tokens';
import { resolveResult, type Scores } from '@/lib/quiz/score';
import {
  SharePoster,
  SHARE_IMAGE_WIDTH,
  SHARE_IMAGE_HEIGHT,
  getShareImageAssets,
} from '@/lib/quiz/share-image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SHARE_LIMIT = 10;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenId = url.searchParams.get('token');
  if (!tokenId) {
    return Response.json({ error: 'missing_token' }, { status: 400 });
  }

  const token = await getToken(tokenId);
  if (!token) {
    return Response.json({ error: 'not_found' }, { status: 404 });
  }
  if (token.state !== 'completed') {
    return Response.json({ error: 'not_completed' }, { status: 409 });
  }

  if (token.shareImageCount >= SHARE_LIMIT) {
    return Response.json(
      { error: 'limit_reached', limit: SHARE_LIMIT },
      { status: 429 },
    );
  }

  const scores = parseStoredScores(token.scores) as Scores | null;
  if (!scores) {
    return Response.json({ error: 'invalid_scores' }, { status: 500 });
  }

  const result = resolveResult(scores);
  const { fonts, sigil, qr } = await getShareImageAssets(result);

  const update = await db
    .update(tokens)
    .set({ shareImageCount: sql`${tokens.shareImageCount} + 1` })
    .where(
      sql`${tokens.id} = ${tokenId} AND ${tokens.shareImageCount} < ${SHARE_LIMIT}`,
    )
    .run();

  if (update.changes === 0) {
    return Response.json(
      { error: 'limit_reached', limit: SHARE_LIMIT },
      { status: 429 },
    );
  }

  const remaining = Math.max(0, SHARE_LIMIT - (token.shareImageCount + 1));

  return new ImageResponse(
    (
      <SharePoster
        result={result}
        scores={scores}
        sigilDataUri={sigil}
        qrDataUri={qr}
      />
    ),
    {
      width: SHARE_IMAGE_WIDTH,
      height: SHARE_IMAGE_HEIGHT,
      fonts: [
        { name: 'NotoSans', data: fonts.regular, weight: 400, style: 'normal' },
        { name: 'NotoSans', data: fonts.bold, weight: 700, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'no-store',
        'X-Share-Remaining': String(remaining),
      },
    },
  );
}
