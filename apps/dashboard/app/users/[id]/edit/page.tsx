import Link from 'next/link';
import { Button, Card, Checkbox, Input } from '@myfood/shared-ui';

interface UserEditProps {
  params: Promise<{
    id: string;
  }>;
}

const permissionOptions = [
  'ดูรายงานรายวัน',
  'อนุมัติออเดอร์พิเศษ',
  'ปรับราคาโปรโมชั่น',
  'จัดการพนักงานประจำกะ'
];

const roleDescriptions: Record<string, string> = {
  admin: 'สามารถเข้าถึงตั้งค่าระบบทั้งหมด',
  manager: 'ควบคุมสต็อก, รายงาน และสิทธิ์พนักงาน',
  staff: 'จัดการออเดอร์และยืนยันการชำระเงิน'
};

export default async function EditUserPage({ params }: UserEditProps) {
  const { id } = await params;
  return (
    <main className="space-y-8">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">แก้ไขผู้ใช้</p>
        <h1 className="text-3xl font-semibold text-slate-900">จัดการบัญชี ID: {id}</h1>
        <p className="text-sm text-slate-600">ปรับบทบาทและสิทธิ์ตามตำแหน่งงานจริง</p>
      </section>

      <Card className="space-y-5">
        <form className="space-y-4">
          <Input label="ชื่อผู้ใช้" defaultValue={`pos_user_${id}`} />
          <Input label="บทบาท" placeholder="ผู้จัดการ" helperText={roleDescriptions.manager} />
          <Input label="อีเมลแจ้งเตือน" type="email" placeholder="manager@example.com" />
          <Input label="รหัสผ่านใหม่" type="password" placeholder="••••••••" />
          <div className="space-y-3">
            {permissionOptions.map((permission) => (
              <Checkbox key={permission} label={permission} defaultChecked />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>บันทึกการเปลี่ยนแปลง</Button>
            <Button intent="secondary" size="sm" asChild>
              <Link href={{ pathname: '/users' }} >กลับไปยังรายชื่อ</Link>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
