import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/contest', '/discuss', '/admin', '/mentor', '/student'];

export function middleware(request) {
  const token = request.cookies.get('eduvantix_auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/contest/:path*', '/discuss/:path*', '/admin/:path*', '/mentor/:path*', '/student/:path*'],
};
