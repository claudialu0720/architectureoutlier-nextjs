import { NextResponse } from 'next/server';
import { verify } from '@node-rs/argon2';
import { signSessionCookie, sessionCookieConfig } from '@/lib/auth/session';
import { checkLoginRateLimit, resetLoginRateLimit } from '@/lib/auth/rate-limit';

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = checkLoginRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: limit.retryAfter },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { username, password } = (body ?? {}) as {
    username?: unknown;
    password?: unknown;
  };

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !expectedHash) {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 500 });
  }

  const usernameOk = username === expectedUsername;
  // Always verify a hash to keep timing roughly constant when username is wrong.
  const passwordOk = await verify(expectedHash, password).catch(() => false);

  if (!usernameOk || !passwordOk) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  resetLoginRateLimit(ip);

  const jwt = await signSessionCookie({ sub: username });
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: sessionCookieConfig.name,
    value: jwt,
    ...sessionCookieConfig.options,
  });
  return res;
}
