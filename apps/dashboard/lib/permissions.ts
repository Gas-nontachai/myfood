export function hasPermission(permissions: string[] | undefined, check: string) {
  if (!check || !permissions) {
    return false;
  }
  return permissions.includes(check);
}
