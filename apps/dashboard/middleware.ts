import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@myfood/shared-types';

const PUBLIC_PATHS = ['/login', '/reset-password', '/account-disabled', '/no-access', '/api'];

export async function middleware(req: NextRequest) {
  const shouldSkip = PUBLIC_PATHS.some((path) => req.nextUrl.pathname.startsWith(path));
  if (shouldSkip) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({
    req,
    res: response,
  });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/font).*)']
};
