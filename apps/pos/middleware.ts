import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@myfood/shared-types';

const PUBLIC_PATHS = ['/login', '/account-disabled', '/no-access'];
const ALLOWED_ROLES = new Set(['admin', 'manager', 'cashier', 'kitchen']);

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }) as unknown as import('@supabase/supabase-js').SupabaseClient<Database>;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname.startsWith(path));

  if (isPublicPath) {
    if (url.pathname.startsWith('/login') && user) {
      url.pathname = '/';
      url.searchParams.delete('from');
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (!user) {
    url.pathname = '/login';
    url.searchParams.set('from', req.nextUrl.pathname);
    url.searchParams.delete('error');
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role_primary')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.status === 'inactive') {
    url.pathname = '/account-disabled';
    url.searchParams.delete('from');
    return NextResponse.redirect(url);
  }

  if (!profile?.role_primary) {
    url.pathname = '/no-access';
    url.searchParams.delete('from');
    return NextResponse.redirect(url);
  }

  const { data: role } = await supabase
    .from('roles')
    .select('name')
    .eq('id', profile.role_primary)
    .maybeSingle();

  if (!role?.name || !ALLOWED_ROLES.has(role.name)) {
    url.pathname = '/no-access';
    url.searchParams.delete('from');
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/font).*)']
};
