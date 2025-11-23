import { Card } from '@myfood/shared-ui';
import { LogoutButton } from '../../../components/LogoutButton';

export default function DashboardNoAccessPage() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">สิทธิ์ไม่เพียงพอ</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">คุณยังไม่สามารถเข้าสู่ระบบนี้ได้</h1>
          <p className="text-sm text-slate-600">
            บัญชีของคุณไม่ได้รับอนุญาตให้ดูแดชบอร์ดผู้ดูแลระบบ หากคิดว่าผิดพลาด กรุณาติดต่อผู้ดูแลระบบเพื่อขอเพิ่มสิทธิ์
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-500">
          <p>• ลองล็อกอินด้วยบัญชีที่มีบทบาทผู้จัดการหรือแอดมิน</p>
          <p>• ตรวจสอบว่าได้ตั้งค่า MFA หรือการยืนยันตัวตนครบถ้วน</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <LogoutButton />
        </div>
      </Card>
    </main>
  );
}
