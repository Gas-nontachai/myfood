import Link from 'next/link';
import { Button, Card, Input } from '@myfood/shared-ui';
import type { Database } from '@myfood/shared-types';
import { createAdminClient } from '../../../../lib/supabaseAdmin';
import {
  resetUserPasswordAction,
  softDeleteUserAction,
  restoreUserAction
} from '../actions';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileUserId = id as Database['public']['Tables']['profiles']['Row']['user_id'];
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('user_id, username, full_name, role_primary, status, created_at')
    .eq('user_id', profileUserId)
    .maybeSingle();

  const { data: roleDetails } = await admin
    .from('user_roles')
    .select('role_id, assigned_at, roles(id, name, description)')
    .eq('user_id', profileUserId);

  const { data: permissions } = await admin.rpc('get_user_permissions', { uid: profileUserId });
  const isActive = profile?.status === 'active';

  if (!profile) {
    return (
      <Card className="text-center">
        <p className="text-sm text-slate-600">ไม่พบข้อมูลผู้ใช้</p>
        <Link href="/dashboard/users" className="text-sm font-semibold text-brand-primary">
          กลับหน้ารายการ
        </Link>
      </Card>
    );
  }

  const { data: primaryRole } = await admin
    .from('roles')
    .select('name')
    .eq('id', profile.role_primary)
    .maybeSingle();
  const primaryRoleName = primaryRole?.name ?? 'ไม่ระบุบทบาท';

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">ผู้ใช้งาน</p>
          <h1 className="text-3xl font-semibold text-slate-900">{profile.username}</h1>
        </div>
        <Link href="/dashboard/users" className="text-sm text-brand-primary">
          กลับหน้ารายการ
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">ข้อมูลโปรไฟล์</h2>
          <dl className="space-y-2 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-900">ชื่อเต็ม</dt>
              <dd>{profile.full_name ?? 'ยังไม่ระบุ'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">บทบาทหลัก</dt>
              <dd>{primaryRoleName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">วันที่สร้างบัญชี</dt>
              <dd>{formatDate(profile.created_at)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">สถานะ</dt>
              <dd>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">บทบาทที่มอบหมาย</h2>
          <div className="space-y-3 text-sm text-slate-600">
            {roleDetails?.map((assignment) => (
              <div
                key={`${assignment.role_id}-${assignment.assigned_at}`}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <p className="font-semibold text-slate-900">{assignment.roles?.[0]?.name}</p>
                <p>{assignment.roles?.[0]?.description ?? 'คำอธิบายยังไม่ถูกกำหนด'}</p>
                <p className="text-xs text-slate-500">มอบหมายเมื่อ {formatDate(assignment.assigned_at)}</p>
              </div>
            ))}
            {!roleDetails?.length && <p className="text-xs text-slate-500">ยังไม่มีบทบาทเพิ่มเติม</p>}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">สิทธิ์ที่ได้รับ</h2>
          <div className="space-y-2 text-sm text-slate-600">
            {(permissions?.permissions as string[] | undefined)?.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {permission}
              </span>
            ))}
            {!(permissions?.permissions as string[] | undefined)?.length && (
              <p className="text-xs text-slate-500">ยังไม่มีสิทธิ์เพิ่มเติม</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">รีเซ็ตรหัสผ่าน</p>
            <h2 className="text-lg font-semibold text-slate-900">ตั้งรหัสผ่านใหม่</h2>
          </div>
          <form className="space-y-3" action={resetUserPasswordAction}>
            <input type="hidden" name="userId" value={profile.user_id} />
            <Input name="password" type="password" label="รหัสผ่านใหม่" placeholder="••••••••" required />
            <Button type="submit">รีเซ็ตรหัสผ่าน</Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">จัดการสถานะ</p>
            <h2 className="text-lg font-semibold text-slate-900">ลบ / กู้คืน</h2>
          </div>
          {isActive ? (
            <form className="space-y-3" action={softDeleteUserAction}>
              <input type="hidden" name="userId" value={profile.user_id} />
              <p className="text-sm text-slate-600">
                ปิดการใช้งานผู้ใช้จะทำให้ไม่สามารถเข้าระบบได้จนกว่าจะกู้คืนโดยแอดมิน
              </p>
              <Button type="submit">
                ปิดใช้งานผู้ใช้
              </Button>
            </form>
          ) : (
            <form className="space-y-3" action={restoreUserAction}>
              <input type="hidden" name="userId" value={profile.user_id} />
              <p className="text-sm text-slate-600">
                กู้คืนบัญชีเพื่อให้ผู้ใช้สามารถล็อกอินได้อีกครั้ง
              </p>
              <Button type="submit">กู้คืนผู้ใช้</Button>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
