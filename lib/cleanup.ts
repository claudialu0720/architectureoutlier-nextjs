import 'server-only';
import { and, eq, lt, sql } from 'drizzle-orm';
import { db } from './db/client';
import { tokens } from './db/schema';

export const CLEANUP_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

function cutoff(): number {
  return Date.now() - CLEANUP_DAYS * DAY_MS;
}

export async function countOldCompleted(): Promise<{ count: number; cutoff: number }> {
  const c = cutoff();
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(tokens)
    .where(and(eq(tokens.state, 'completed'), lt(tokens.completedAt, c)))
    .get();
  return { count: row?.count ?? 0, cutoff: c };
}

export async function deleteOldCompleted(): Promise<{ deleted: number; cutoff: number }> {
  const c = cutoff();
  const result = await db
    .delete(tokens)
    .where(and(eq(tokens.state, 'completed'), lt(tokens.completedAt, c)))
    .run();
  return { deleted: result.changes ?? 0, cutoff: c };
}
