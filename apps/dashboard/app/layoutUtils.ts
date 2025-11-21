// Include both top-level and dashboard-scoped login routes. The app's login lives under /dashboard/login
export const HIDE_LAYOUT_ROUTES = ['/login', '/dashboard/login', '/dashboard/no-access', '/account-disabled'];

export function computeShouldHideLayout(pathname: string) {
  return HIDE_LAYOUT_ROUTES.some((p) => pathname.startsWith(p));
}

export default computeShouldHideLayout;
