import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tokens } from '@/lib/db/schema';

const testLabelMatch = sql`lower(trim(${tokens.label})) = 'test'`;

export async function GET() {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(tokens)
    .where(testLabelMatch)
    .get();
  return NextResponse.json({ count: row?.count ?? 0 });
}

export async function DELETE() {
  const result = await db.delete(tokens).where(testLabelMatch).run();
  return NextResponse.json({ deleted: result.changes ?? 0 });
}
