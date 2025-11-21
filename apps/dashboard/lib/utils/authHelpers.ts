export function usernameToEmail(username: string) {
  const EMAIL_DOMAIN = 'local.local';
  return `${username.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}
