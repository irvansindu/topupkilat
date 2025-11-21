import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    const user = req.auth?.user as { role?: string } | undefined;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
