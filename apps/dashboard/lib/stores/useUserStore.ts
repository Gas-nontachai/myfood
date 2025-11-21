'use client';

import { create } from 'zustand';

export type UserState = {
  userId: string | null;
  username: string | null;
  fullName: string | null;
  roles: string[];
  permissions: string[];
  status: 'active' | 'inactive' | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (payload: Partial<Omit<UserState, 'setUser' | 'can' | 'clear'>>) => void;
  clear: () => void;
  // eslint-disable-next-line no-unused-vars
  can: (permission: string) => boolean;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: null,
  fullName: null,
  roles: [],
  permissions: [],
  status: null,
  setUser: (payload) =>
    set((state) => ({
      ...state,
      userId: payload.userId ?? state.userId,
      username: payload.username ?? state.username,
      fullName: payload.fullName ?? state.fullName,
      roles: payload.roles ?? state.roles,
      status: payload.status ?? state.status,
      permissions: payload.permissions ?? state.permissions
    })),
  clear: () =>
    set((state) => ({
      ...state,
      userId: null,
      username: null,
      fullName: null,
      roles: [],
      status: null,
      permissions: []
    })),
  can: (permission) => {
    if (!permission) return false;
    return useUserStore.getState().permissions.includes(permission);
  }
}));

export const useCan = (permission: string) => useUserStore((state) => state.can(permission));
