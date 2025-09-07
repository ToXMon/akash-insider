import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin/dashboard')) {
    const token = req.cookies.get('admin-token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin', req.url));
    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

