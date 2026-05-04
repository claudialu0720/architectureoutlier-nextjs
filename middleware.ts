import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionCookie } from './lib/auth/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith('/test/admin');
  const isAdminApi = pathname.startsWith('/test/api/admin');
  const isLogin =
    pathname === '/test/admin/login' || pathname === '/test/api/admin/login';

  if ((isAdminPage || isAdminApi) && !isLogin) {
    const cookie = req.cookies.get('careertest_session')?.value;
    const ok = cookie ? await verifySessionCookie(cookie) : false;
    if (!ok) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = '/test/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/test/admin/:path*', '/test/api/admin/:path*'],
};
