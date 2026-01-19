import { NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/auth') ||
    !pathname.startsWith('/api') &&
    !isProtectedPath(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return handleUnauthorized(request);
  }

  const session = await verifySession(token);
  if (!session) {
    return handleUnauthorized(request);
  }

  return NextResponse.next();
}

function isProtectedPath(pathname) {
  if (pathname === '/dashboard') return true;
  if (pathname.startsWith('/entries')) return true;
  if (pathname.startsWith('/projects')) return true;
  if (pathname.startsWith('/reports')) return true;
  if (pathname.startsWith('/settings')) return true;
  if (pathname.startsWith('/timer')) return true;
  if (pathname.startsWith('/profile')) return true;
  return false;
}

function handleUnauthorized(request) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/auth/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
