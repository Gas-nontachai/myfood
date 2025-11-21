import Link from 'next/link';
import { Button, Card } from '@myfood/shared-ui';

export default function ResetPasswordPage() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="max-w-xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">ความปลอดภัยสูงสุด</p>
        <h1 className="text-3xl font-semibold text-slate-900">รีเซ็ตรหัสผ่าน</h1>
        <p className="text-sm text-slate-600">
          ส่งคำขอรีเซ็ตรหัสผ่านไปยังทีมแอดมิน แพลตฟอร์มจะส่งลิงก์ไปยังอีเมลที่ลงทะเบียนไว้
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button intent="primary" asChild>
            <Link href="/login">กลับไปหน้าเข้าสู่ระบบ</Link>
          </Button>
          <Button intent="secondary" asChild>
            <Link href="/">กลับไปแดชบอร์ด</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
