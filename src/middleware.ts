import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('timeline.token');
  const url = request.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith('/auth');
  
  if (!token && !isAuthPage) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
  
  if (token && isAuthPage) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/timelines/:path*',
    '/auth/:path*',
  ],
}; 