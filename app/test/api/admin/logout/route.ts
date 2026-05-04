import { NextResponse } from 'next/server';
import { sessionCookieConfig } from '@/lib/auth/session';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: sessionCookieConfig.name,
    value: '',
    ...sessionCookieConfig.options,
    maxAge: 0,
  });
  return res;
}
