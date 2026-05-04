import { NextResponse } from 'next/server';
import { getEmailEnabled, setSetting, SETTING_KEYS } from '@/lib/settings';

export async function GET() {
  return NextResponse.json({
    emailEnabled: await getEmailEnabled(),
  });
}

export async function PATCH(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { emailEnabled } = (body ?? {}) as { emailEnabled?: unknown };
  if (typeof emailEnabled === 'boolean') {
    await setSetting(SETTING_KEYS.emailEnabled, emailEnabled ? 'true' : 'false');
  }

  return NextResponse.json({ emailEnabled: await getEmailEnabled() });
}
