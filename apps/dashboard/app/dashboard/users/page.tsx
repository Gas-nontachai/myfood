import Link from 'next/link';
import { Button, Card, Input, Toast } from '@myfood/shared-ui';
import { hasPermission } from '../../../lib/permissions';
import { loadCurrentUser } from '../../../lib/auth';
import { createAdminClient } from '../../../lib/supabaseAdmin';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

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
    .order('created_at', { ascending: false })
    .ilike('username', resolvedParams?.q ? `%${resolvedParams.q}%` : '%');

  const { data: roles } = await admin.from('roles').select('id, name');
  const roleById = new Map(roles?.map((role) => [role.id, role.name]));
  const userSession = await loadCurrentUser();
  const canManageUsers = hasPermission(userSession?.permissions.permissions, 'user.manage');

  const inlineAlerts = [] as { variant: 'success' | 'info' | 'warning'; title: string; description: string }[];
  if (resolvedParams?.created === 'true') {
    inlineAlerts.push({ variant: 'success', title: 'ผู้ใช้ถูกสร้างแล้ว', description: 'เปิดดูรายละเอียดหรือกำหนดสิทธิ์เพิ่มเติมได้' });
  }
  if (resolvedParams?.disabled) {
    inlineAlerts.push({ variant: 'warning', title: 'ผู้ใช้ถูกปิดใช้งาน', description: 'บัญชีนี้จะไม่สามารถล็อกอินได้จนกว่าจะกู้คืน' });
  }
  if (resolvedParams?.restored) {
    inlineAlerts.push({ variant: 'success', title: 'เรียกคืนบัญชีสำเร็จ', description: 'ผู้ใช้สามารถล็อกอินได้อีกครั้ง' });
  }
  if (resolvedParams?.passwordReset) {
    inlineAlerts.push({ variant: 'info', title: 'รีเซ็ตรหัสผ่านแล้ว', description: 'ผู้ใช้สามารถใช้รหัสผ่านใหม่ได้ทันที' });
  }
  if (resolvedParams?.error) {
    inlineAlerts.push({ variant: 'warning', title: 'เกิดข้อผิดพลาด', description: resolvedParams.error });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">ผู้ดูแลระบบ</p>
          <h1 className="text-3xl font-semibold text-slate-900">จัดการผู้ใช้</h1>
        </div>
        {canManageUsers && (
          <Button intent="secondary" asChild>
            <Link href="/dashboard/users/create">เพิ่มผู้ใช้ใหม่</Link>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {inlineAlerts.map((toast) => (
          <Toast
            key={toast.title}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
          />
        ))}
      </div>

      <Card className="space-y-4">
        <form className="flex flex-col gap-3 md:flex-row" method="get" action="/dashboard/users">
          <Input name="q" placeholder="ค้นหาชื่อผู้ใช้" defaultValue={resolvedParams?.q ?? ''} />
          <Button type="submit">ค้นหาผู้ใช้</Button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                <th className="px-3 py-2">ชื่อผู้ใช้</th>
                <th className="px-3 py-2">บทบาทหลัก</th>
                <th className="px-3 py-2">วันที่สร้าง</th>
                <th className="px-3 py-2">สถานะ</th>
                <th className="px-3 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {(profiles ?? []).map((profile) => (
                <tr key={profile.user_id} className="border-t border-slate-100">
                  <td className="px-3 py-3">
                    <Link href={`/dashboard/users/${profile.user_id}`} className="font-semibold text-slate-900">
                      {profile.username}
                    </Link>
                    <p className="text-xs text-slate-500">{profile.full_name ?? 'ชื่อเต็มยังไม่ได้ระบุ'}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {roleById.get(profile.role_primary ?? -1) ?? 'ไม่ระบุบทบาท'}
                  </td>
                  <td className="px-3 py-3 text-slate-500">{formatDate(profile.created_at)}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        profile.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {profile.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/dashboard/users/${profile.user_id}`} className="text-sm text-brand-primary">
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
