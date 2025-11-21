import Link from 'next/link';
import { Button, Card, Input } from '@myfood/shared-ui';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">MyFood Admin</p>
          <h1 className="text-2xl font-semibold text-slate-900">เข้าสู่ระบบผู้ดูแลระบบ</h1>
          <p className="text-sm text-slate-600">กรุณาใช้บัญชีที่ได้รับอนุญาตเท่านั้น</p>
        </div>
        <form className="space-y-4">
          <Input label="ชื่อผู้ใช้" placeholder="admin.myfood" />
          <Input label="รหัสผ่าน" type="password" placeholder="••••••••" helperText="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" />
          <Button className="w-full">เข้าสู่ระบบ</Button>
        </form>
        <div className="text-center text-xs text-slate-500">
          <p>
            ลืมรหัสผ่านหรือไม่? <Link href={{ pathname: '/reset-password' }} className="font-semibold text-brand-primary">รีเซ็ตใหม่</Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
