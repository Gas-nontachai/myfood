import Link from 'next/link';
import { Button, Card, Checkbox, Input } from '@myfood/shared-ui';

const posUsers = [
  {
    id: 'u1',
    username: 'pim-pos',
    role: 'ผู้จัดการ',
    area: 'โซนหลัก',
    status: 'ออนไลน์'
  },
  {
    id: 'u2',
    username: 'team-kitchen',
    role: 'พนักงาน',
    area: 'ครัวกลาง',
    status: 'ทำงานอยู่'
  },
  {
    id: 'u3',
    username: 'delivery-mgr',
    role: 'ผู้จัดการ',
    area: 'เดลิเวอรี่',
    status: 'ออฟไลน์'
  }
];

const permissionOptions = [
  { label: 'จัดการเมนูอาหาร', description: 'เพิ่ม/แก้ไขเมนูและราคา' },
  { label: 'ดูรายงานรายวัน', description: 'เข้าถึงสรุปเวลาเปิด/ปิด' },
  { label: 'ส่งคำสั่งไปครัว', description: 'อนุมัติออเดอร์และรีวิวสถานะ' },
  { label: 'กำหนดโปรโมชั่น', description: 'ควบคุมโค้ดส่วนลดและแคมเปญ' }
];

const roles = ['ผู้ดูแลระบบ', 'ผู้จัดการ', 'พนักงาน'];

export default function PosUsersPage() {
  return (
    <main className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ผู้ใช้ POS</p>
            <h2 className="text-3xl font-semibold text-slate-900">รายชื่อผู้ใช้</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">
              + เพิ่มผู้ใช้ใหม่
            </Button>
            <Button intent="secondary" size="sm" asChild>
              <Link href={{ pathname: '/users/u1/edit' }}>แก้ไขด่วน</Link>
            </Button>
          </div>
        </div>
        <Card className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {posUsers.map((user) => (
              <div key={user.id} className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{user.username}</p>
                  <span className="text-xs text-slate-500">{user.status}</span>
                </div>
                <p className="text-sm text-slate-600">บทบาท: {user.role}</p>
                <p className="text-sm text-slate-600">พื้นที่: {user.area}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">แบบฟอร์มสร้างผู้ใช้</p>
            <h3 className="text-lg font-semibold text-slate-900">ข้อมูลบัญชีใหม่</h3>
          </div>
          <form className="space-y-4">
            <Input label="ชื่อผู้ใช้งาน" placeholder="ชื่อผู้ใช้ เช่น pos@example" />
            <Input label="รหัสผ่าน" type="password" placeholder="••••••••" helperText="ขั้นต่ำ 8 ตัวอักษร" />
            <div>
              <label className="text-sm font-semibold text-slate-700">บทบาท</label>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {permissionOptions.map((permission) => (
                <Checkbox
                  key={permission.label}
                  label={permission.label}
                  description={permission.description}
                />
              ))}
            </div>
            <Button className="w-full">บันทึกผู้ใช้ใหม่</Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ตั้งค่าบทบาท</p>
            <h3 className="text-lg font-semibold text-slate-900">จำลองบทบาทตามหน้าที่</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>• ผู้ดูแลระบบ: เข้าถึงทุกหน้าจอและตั้งค่าบทบาท</p>
            <p>• ผู้จัดการ: ดูรายงาน, จัดการโปรโมชั่น, ดูงานพนักงาน</p>
            <p>• พนักงาน: สร้างออเดอร์, ยืนยันการชำระเงิน, แจ้งเตือนครัว</p>
          </div>
          <Button size="sm" intent="secondary" asChild>
            <Link href={{ pathname: '/users/u2/edit' }}>แก้ไขสิทธิ์ผู้จัดการ</Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}
