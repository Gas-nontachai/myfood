import Link from 'next/link';
import { Button, Card } from '@myfood/shared-ui';

export default function AccountDisabledPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">บัญชีถูกระงับ</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">บัญชีของคุณถูกปิดใช้งาน</h1>
          <p className="text-sm text-slate-600">
            ผู้ดูแลระบบได้ปิดใช้งานบัญชีของคุณ หากคิดว่าผิดพลาด กรุณาติดต่อทีมที่ดูแลระบบเพื่อตรวจสอบสถานะ
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/login">กลับหน้าล็อกอิน</Link>
          </Button> 
        </div>
      </Card>
    </main>
  );
}
