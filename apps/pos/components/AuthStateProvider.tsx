'use client';

import { type ReactNode, useEffect } from 'react';
import type { SessionWithAuth } from '../lib/auth';
import { useUserStore } from '../lib/stores/useUserStore';

type AuthStateProviderProps = {
  children: ReactNode;
  initialUser: SessionWithAuth | null;
};

export function AuthStateProvider({ children, initialUser }: AuthStateProviderProps) {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clear);

  useEffect(() => {
    if (!initialUser) {
      clearUser();
      return;
    }

    const { userId, profile, permissions } = initialUser;
    const roles = permissions.roles ?? [];
    const perms = permissions.permissions ?? [];

    setUser({
      userId,
      username: profile?.username ?? null,
      fullName: profile?.full_name ?? null,
      roles,
      permissions: perms,
      status: profile?.status ?? null
    });
  }, [clearUser, initialUser, setUser]);

  return <>{children}</>;
}
