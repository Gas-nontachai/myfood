'use client';

import { type ReactNode, useEffect } from 'react';
import { AUTH_COOKIE_KEYS } from '../lib/constants/authCookies';
import { useUserStore } from '../lib/stores/useUserStore';
import type { UserState } from '../lib/stores/useUserStore';

const decodeJson = <T,>(value: string | null | undefined, fallback: T) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('[AuthStateProvider] failed to parse cookie', error);
    return fallback;
  }
};

const readCookie = (key: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${key}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

export function AuthStateProvider({ children }: { children: ReactNode }) {
  const setUser = useUserStore((state: UserState) => state.setUser);

  useEffect(() => {
    const profile = decodeJson<Record<string, unknown> | null>(readCookie(AUTH_COOKIE_KEYS.profile), null);
    const username = typeof profile?.username === 'string' ? profile.username : null;
    const fullName = typeof profile?.full_name === 'string' ? profile.full_name : null;
    const roles = decodeJson<string[]>(readCookie(AUTH_COOKIE_KEYS.roles), []);
    const permissions = decodeJson<string[]>(readCookie(AUTH_COOKIE_KEYS.permissions), []);
    const status = typeof profile?.status === 'string' ? (profile.status as 'active' | 'inactive') : null;
    const userId = readCookie(AUTH_COOKIE_KEYS.id);

    if (userId) {
      setUser({ userId, username, fullName, roles, permissions, status });
    }
  }, [setUser]);

  return <>{children}</>;
}
