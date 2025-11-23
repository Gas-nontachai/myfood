export const HIDE_LAYOUT_ROUTES = ['/login', '/no-access', '/account-disabled'];

export function computeShouldHideLayout(pathname: string) {
  return HIDE_LAYOUT_ROUTES.some((p) => pathname.startsWith(p));
}

export default computeShouldHideLayout;
