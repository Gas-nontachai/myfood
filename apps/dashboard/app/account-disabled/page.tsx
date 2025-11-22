import { Card } from '@myfood/shared-ui';
import { LogoutButton } from '../../components/LogoutButton';

export default function AccountDisabledPage() {
  return (
    <main className="flex min-h-dvh items-start justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-xl space-y-8 text-center p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          บัญชีถูกระงับ
        </p>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900">
            บัญชีของคุณถูกปิดใช้งาน
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            ผู้ดูแลระบบได้ปิดใช้งานบัญชีของคุณ หากคิดว่ามีข้อผิดพลาด
            กรุณาติดต่อทีมผู้ดูแลเพื่อช่วยตรวจสอบสถานะบัญชีของคุณ
          </p>
        </div>

        <div className="flex justify-center">
          <LogoutButton label='กลับหน้าล็อกอิน' />
        </div>
      </Card>
    </main>
  );
}
