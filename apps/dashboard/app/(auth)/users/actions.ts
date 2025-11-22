'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { usernameToEmail } from '../../../lib/utils/authHelpers';

const usersRedirect = (query?: string) => redirect(`/users${query ? `?${query}` : ''}`);

export async function createUserAction(formData: FormData) {
  const username = (formData.get('username') ?? '').toString().trim();
  const password = (formData.get('password') ?? '').toString();
  const fullName = (formData.get('fullName') ?? '').toString().trim() || null;
  const rolePrimary = Number(formData.get('rolePrimary')) || null;

  if (!username || !password || !rolePrimary) {
    usersRedirect('error=กรุณากรอกข้อมูลทั้งหมด');
    return;
  }

  const admin = createAdminClient();
  const email = usernameToEmail(username);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username }
  });

  if (error || !data.user) {
    usersRedirect(`error=${encodeURIComponent(error?.message ?? 'ไม่สามารถสร้างบัญชีได้')}`);
    return;
  }

  await admin.from('profiles').insert({
    user_id: data.user.id,
    username,
    full_name: fullName,
    role_primary: rolePrimary,
    status: 'active'
  });

  await admin.from('user_roles').insert({
    user_id: data.user.id,
    role_id: rolePrimary
  });

  usersRedirect('created=true');
}

export async function resetUserPasswordAction(formData: FormData) {
  const userId = (formData.get('userId') ?? '').toString();
  const password = (formData.get('password') ?? '').toString();

  if (!userId || !password) {
    usersRedirect('error=รหัสผ่านใหม่ไม่ถูกต้อง');
    return;
  }

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(userId, { password });
  usersRedirect('passwordReset=true');
}

export async function softDeleteUserAction(formData: FormData) {
  const userId = (formData.get('userId') ?? '').toString();
  if (!userId) {
    usersRedirect('error=ไม่พบผู้ใช้');
    return;
  }

  const admin = createAdminClient();
  await admin.from('profiles').update({ status: 'inactive' }).eq('user_id', userId);
  await admin.auth.admin.updateUserById(userId, { user_metadata: { deleted: true } });
  usersRedirect('disabled=true');
}

export async function restoreUserAction(formData: FormData) {
  const userId = (formData.get('userId') ?? '').toString();
  if (!userId) {
    usersRedirect('error=ไม่พบผู้ใช้');
    return;
  }

  const admin = createAdminClient();
  await admin.from('profiles').update({ status: 'active' }).eq('user_id', userId);
  await admin.auth.admin.updateUserById(userId, { user_metadata: { deleted: false } });
  usersRedirect('restored=true');
}
