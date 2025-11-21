import Link from 'next/link';
import { Button, Card, Input } from '@myfood/shared-ui';
import { createAdminClient } from '../../../../lib/supabaseAdmin';
import { createUserAction } from '../actions';

export default async function CreateUserPage() {
  const admin = createAdminClient();
  const { data: roles } = await admin.from('roles').select('id, name').order('name');

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการผู้ใช้</p>
          <h1 className="text-3xl font-semibold text-slate-900">สร้างผู้ดูแลระบบใหม่</h1>
        </div>
        <Button intent="secondary" asChild>
          <Link href="/dashboard/users">กลับหน้ารายการ</Link>
        </Button>
      </div>
      <Card className="space-y-6">
        <form className="space-y-4" action={createUserAction}>
          <Input name="username" label="ชื่อผู้ใช้" placeholder="username" required />
          <Input
            name="password"
            label="รหัสผ่าน"
            type="password"
            placeholder="อย่างน้อย 8 ตัวอักษร"
            helperText="ระบบจะจัดเก็บเป็นรหัสผ่านที่เข้ารหัส"
            required
          />
          <Input name="fullName" label="ชื่อเต็ม" placeholder="ชื่อ-นามสกุล" />
          <label className="block space-y-1 text-sm">
            <span className="text-slate-700 font-semibold">บทบาทหลัก</span>
            <select
              name="rolePrimary"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            >
              <option value="">เลือกบทบาท</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <Button className="w-full" type="submit">
            สร้างผู้ใช้ใหม่
          </Button>
        </form>
      </Card>
    </section>
  );
}
