import { Button, Card, Input, Toast } from '@myfood/shared-ui';
import { loginAction, loadCurrentUser } from '../../lib/auth';
import { redirect } from 'next/navigation';

type SearchParams = {
  error?: string;
  from?: string;
};

type LoginPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await loadCurrentUser();
  if (session) {
    redirect(session.permissions.roles.includes('admin') ? '/dashboard' : '/no-access');
  }
  const resolved = await searchParams;
  const errorMessage = typeof resolved?.error === 'string' ? resolved.error : null;
  const redirectTo = typeof resolved?.from === 'string' ? resolved.from : '/dashboard';

  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-50 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">MyFood Admin</p>
          <h1 className="text-2xl font-semibold text-slate-900">เข้าสู่ระบบผู้ดูแลระบบ</h1>
          <p className="text-sm text-slate-600">กรุณาใช้บัญชีที่ได้รับอนุญาตเท่านั้น</p>
        </div>
        {errorMessage && (
          <Toast variant="warning" title="ไม่สามารถเข้าสู่ระบบ" description={errorMessage} accent="ตรวจสอบข้อมูล" />
        )}
        <form className="space-y-4" action={loginAction}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Input name="username" label="ชื่อผู้ใช้" placeholder="admin.myfood" required autoFocus />
          <Input
            name="password"
            label="รหัสผ่าน"
            type="password"
            placeholder="••••••••"
            helperText="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
            required
          />
          <Button className="w-full" type="submit">
            เข้าสู่ระบบ
          </Button>
        </form>
      </Card>
    </main>
  );
}
