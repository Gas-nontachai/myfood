import { Button, Card, Input } from '@myfood/shared-ui';

export default function PosLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">โต๊ะขาย</p>
          <h1 className="text-2xl font-semibold text-slate-900">เข้าสู่ระบบ POS</h1>
          <p className="text-sm text-slate-600">ใช้ชื่อผู้ใช้และรหัสผ่านแยกสำหรับพนักงานแต่ละคน</p>
        </div>
        <form className="space-y-4">
          <Input label="ชื่อผู้ใช้" placeholder="pos.staff" />
          <Input label="รหัสผ่าน" type="password" placeholder="••••••••" />
          <Button className="w-full">เข้าสู่ระบบ</Button>
        </form>
        <p className="text-center text-xs text-slate-500">หากมีปัญหาให้ติดต่อผู้จัดการหรือฝ่ายไอที</p>
      </Card>
    </main>
  );
}
