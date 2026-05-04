import { NextResponse } from 'next/server';
import { countOldCompleted, deleteOldCompleted, CLEANUP_DAYS } from '@/lib/cleanup';

export async function GET() {
  const { count, cutoff } = await countOldCompleted();
  return NextResponse.json({ count, cutoff, days: CLEANUP_DAYS });
}

export async function DELETE() {
  const { deleted, cutoff } = await deleteOldCompleted();
  return NextResponse.json({ deleted, cutoff, days: CLEANUP_DAYS });
}
