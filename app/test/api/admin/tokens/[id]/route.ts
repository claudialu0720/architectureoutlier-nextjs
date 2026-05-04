import { NextResponse } from 'next/server';
import { revokeToken, getToken } from '@/lib/tokens';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getToken(id);
  if (!token) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ token });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { action } = (body ?? {}) as { action?: unknown };

  if (action !== 'revoke') {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  }

  const token = await revokeToken(id);
  if (!token) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (token.state !== 'revoked') {
    return NextResponse.json(
      { error: 'cannot_revoke', state: token.state },
      { status: 409 },
    );
  }
  return NextResponse.json({ token });
}
