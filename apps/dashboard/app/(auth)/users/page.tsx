import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { hasPermission } from '../../../lib/permissions';
import { loadCurrentUser } from '../../../lib/auth';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { UsersList } from './UsersList';

type UsersPageParams = {
  searchParams?: Promise<{
    q?: string;
    created?: string;
    error?: string;
    disabled?: string;
    restored?: string;
    passwordReset?: string;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageParams) {
  const resolvedParams = await searchParams;
  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from('profiles')
    .select('user_id, username, full_name, status, role_primary, created_at')
    .order('created_at', { ascending: false });

  const { data: roles } = await admin.from('roles').select('id, name');
  const userSession = await loadCurrentUser();
  const canManageUsers = hasPermission(userSession?.permissions.permissions, 'user.manage');

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">ผู้ดูแลระบบ</p>
          <h1 className="text-3xl font-semibold text-slate-900">จัดการผู้ใช้</h1>
        </div>
        {canManageUsers && (
          <Button intent="secondary" asChild>
            <Link href={{ pathname: "/users/create" }}>เพิ่มผู้ใช้ใหม่</Link>
          </Button>
        )}
      </div>

      <UsersList profiles={profiles ?? []} roles={roles ?? []} searchParams={resolvedParams} />
    </section>
  );
}
