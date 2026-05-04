import { NextResponse } from 'next/server';
import { createToken } from '@/lib/tokens';

export async function POST() {
  const token = await createToken({ label: 'public-homepage' });
  return NextResponse.json({ token: token.id });
}
