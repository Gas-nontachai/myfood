 'use server';

 'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@myfood/shared-types';
import { createAdminClient } from './supabaseAdmin';
import { AUTH_COOKIE_KEYS } from './constants/authCookies';
import { usernameToEmail } from './utils/authHelpers';

type PermissionPayload = {
  roles: string[];
  permissions: string[];
};

export type AdminProfile = {
  user_id: string;
  username: string;
  full_name: string | null;
  role_primary: number | null;
  status: 'active' | 'inactive';
  created_at: string;
};

export type SessionWithAuth = {
  userId: string;
  email: string;
  profile: AdminProfile | null;
  permissions: PermissionPayload;
};

async function fetchProfile(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .select('user_id, username, full_name, role_primary, status, created_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async function fetchPermissions(userId: string): Promise<PermissionPayload> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc('get_user_permissions', { uid: userId });
  if (error) {
    throw new Error(error.message);
  }
  return {
    roles: Array.isArray(data?.roles) ? data.roles.filter(Boolean) : [],
    permissions: Array.isArray(data?.permissions) ? data.permissions.filter(Boolean) : []
  };
}

export async function loadCurrentUser(): Promise<SessionWithAuth | null> {
  const cookieStore = await cookies();
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  });
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    return null;
  }
  const { user } = data.session;
  const [profile, permissions] = await Promise.all([fetchProfile(user.id), fetchPermissions(user.id)]);
  return {
    userId: user.id,
    email: user.email ?? '',
    profile,
    permissions
  };
}

export async function loginAction(formData: FormData) {
  const username = (formData.get('username') ?? '').toString().trim();
  const password = (formData.get('password') ?? '').toString();
  const redirectTo = (formData.get('redirectTo') ?? '/dashboard').toString();

  if (!username || !password) {
    redirect(`/login?error=${encodeURIComponent('โปรดกรอกชื่อผู้ใช้และรหัสผ่าน')}`);
  }

  const cookieStore = await cookies();
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  });
  const email = usernameToEmail(username);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  });
  await supabase.auth.signOut();
  Object.values(AUTH_COOKIE_KEYS).forEach((name) => cookieStore.delete(name));
  redirect('/login');
}
