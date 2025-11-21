import { Card } from '@myfood/shared-ui';

export default function PosLoadingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12">
      <Card className="w-full max-w-sm space-y-6 text-center">
        <div className="flex items-center justify-center">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">กำลังโหลดระบบ POS</h1>
          <p className="text-sm text-slate-600">
            ระบบกำลังตรวจสอบอุปกรณ์และฐานข้อมูล ท่านจะเห็นเมนูหลักหลังจากขั้นตอนนี้
          </p>
          <p className="text-xs text-slate-500">หากใช้เวลานาน ให้รีเฟรชหน้าจอหรือแจ้งฝ่ายสนับสนุน</p>
        </div>
      </Card>
    </main>
  );
}
