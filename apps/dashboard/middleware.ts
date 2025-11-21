import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@myfood/shared-types';
import { createAdminClient } from './lib/supabaseAdmin';
import { AUTH_COOKIE_KEYS } from './lib/constants/authCookies';

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
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('user_id, username, full_name, role_primary, status, created_at')
    .eq('user_id', session.user.id)
    .maybeSingle();

  const disabledUrl = new URL('/account-disabled', req.url);
  if (!profile) {
    return NextResponse.redirect(disabledUrl);
  }

  if (profile.status !== 'active') {
    return NextResponse.redirect(disabledUrl);
  }

  const { data: role } = await admin
    .from('roles')
    .select('id, name')
    .eq('id', profile.role_primary)
    .maybeSingle();
  const roleName = role?.name ?? null;
  if (roleName !== 'admin') {
    const noAccessUrl = new URL('/no-access', req.url);
    return NextResponse.redirect(noAccessUrl);
  }

  const { data: permissionPayload } = await admin.rpc('get_user_permissions', { uid: session.user.id });
  const roles = Array.isArray(permissionPayload?.roles) ? permissionPayload.roles.filter(Boolean) : [];
  const permissions = Array.isArray(permissionPayload?.permissions)
    ? permissionPayload.permissions.filter(Boolean)
    : [];

  response.cookies.set(AUTH_COOKIE_KEYS.id, session.user.id, { path: '/' });
  response.cookies.set(
    AUTH_COOKIE_KEYS.profile,
    JSON.stringify({
      username: profile.username,
      full_name: profile.full_name,
      role_primary: profile.role_primary,
      status: profile.status
    }),
    { path: '/' }
  );
  response.cookies.set(AUTH_COOKIE_KEYS.roles, JSON.stringify(roles), { path: '/' });
  response.cookies.set(AUTH_COOKIE_KEYS.permissions, JSON.stringify(permissions), { path: '/' });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/font).*)']
};
