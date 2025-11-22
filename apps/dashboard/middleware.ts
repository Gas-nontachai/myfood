import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@myfood/shared-types';

const PUBLIC_PATHS = ['/login', '/account-disabled', '/no-access'];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (PUBLIC_PATHS.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }) as any as import('@supabase/supabase-js').SupabaseClient<Database>;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    url.pathname = "/login";
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.status === "inactive") {
    url.pathname = "/account-disabled";
    return NextResponse.redirect(url);
  }

  if (profile?.role_primary) {
    const { data: role } = await supabase
      .from("roles")
      .select("name")
      .eq("id", profile.role_primary)
      .maybeSingle();

    if (role?.name !== "admin") {
      url.pathname = "/no-access";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/font).*)'],
};
