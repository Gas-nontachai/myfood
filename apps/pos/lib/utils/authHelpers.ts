export function usernameToEmail(username: string) {
  const EMAIL_DOMAIN = 'local.local';
  return `${username.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}

export function sanitizeRedirectPath(path?: string | null, fallback = '/') {
  if (typeof path !== 'string') return fallback;
  const trimmed = path.trim();
  if (!trimmed.startsWith('/')) return fallback;
  if (trimmed.startsWith('//')) return fallback;
  if (trimmed.includes('://')) return fallback;
  return trimmed || fallback;
}
