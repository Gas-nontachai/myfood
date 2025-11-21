import { Button, Card, Input } from '@myfood/shared-ui';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12">
      <Card className="w-full max-w-lg space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">รีเซ็ตรหัสผ่าน</p>
          <h1 className="text-2xl font-semibold text-slate-900">ตั้งรหัสผ่านใหม่สำหรับผู้ดูแล</h1>
          <p className="text-sm text-slate-600">ระบุชื่อผู้ใช้แล้วระบบจะจัดเตรียมรหัสผ่านชั่วคราวให้</p>
        </div>
        <form className="space-y-4">
          <Input label="ชื่อผู้ใช้" placeholder="admin.myfood" />
          <Input label="อีเมลที่ลงทะเบียน" type="email" placeholder="admin@myfood.co" />
          <Input label="รหัสผ่านใหม่" type="password" placeholder="••••••••" />
          <Input label="ยืนยันรหัสผ่าน" type="password" placeholder="••••••••" />
          <Button className="w-full">ส่งคำขอรีเซ็ต</Button>
        </form>
        <p className="text-xs text-slate-500">
          ระบบจะตรวจสอบความถูกต้องและแจ้งอัปเดตผ่านทางอีเมลหรือติดต่อทีม IT หากไม่พบข้อมูล
        </p>
      </Card>
    </main>
  );
}
