import { NextResponse } from 'next/server';
import { desc, eq, and, like, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tokens } from '@/lib/db/schema';
import { createToken, createTokensBatch } from '@/lib/tokens';

const MAX_BATCH = 500;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const state = url.searchParams.get('state');
  const orderId = url.searchParams.get('orderId');
  const label = url.searchParams.get('label');
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 100), 500);
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0);

  const conditions: SQL[] = [];
  if (state === 'created' || state === 'completed' || state === 'revoked') {
    conditions.push(eq(tokens.state, state));
  }
  if (orderId) conditions.push(eq(tokens.orderId, orderId));
  if (label) conditions.push(like(tokens.label, `%${label}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const rows = await db
    .select()
    .from(tokens)
    .where(where)
    .orderBy(desc(tokens.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ tokens: rows });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { mode, count, orderId, label } = (body ?? {}) as {
    mode?: unknown;
    count?: unknown;
    orderId?: unknown;
    label?: unknown;
  };

  const labelVal =
    typeof label === 'string' && label.trim().length > 0 ? label.trim() : null;

  if (mode === 'batch') {
    const n = typeof count === 'number' ? Math.floor(count) : 0;
    if (n < 1 || n > MAX_BATCH) {
      return NextResponse.json(
        { error: 'invalid_count', max: MAX_BATCH },
        { status: 400 },
      );
    }
    const created = await createTokensBatch(n, labelVal);
    return NextResponse.json({ tokens: created });
  }

  if (mode === 'single') {
    if (typeof orderId !== 'string' || orderId.trim().length === 0) {
      return NextResponse.json({ error: 'order_id_required' }, { status: 400 });
    }
    const created = await createToken({
      orderId: orderId.trim(),
      label: labelVal,
    });
    return NextResponse.json({ token: created });
  }

  return NextResponse.json({ error: 'invalid_mode' }, { status: 400 });
}
