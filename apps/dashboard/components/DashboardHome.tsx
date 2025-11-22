import Link from 'next/link';
import { Button, Card, Dialog, Toast } from '@myfood/shared-ui';
import { hasPermission } from '../lib/permissions';
import type { SessionWithAuth } from '../lib/auth';

const revenueSummary = [
  { label: 'ยอดขายวันนี้', amount: '฿124,300', detail: '+12% จากเมื่อวานนี้' },
  { label: 'ยอดจองล่วงหน้า', amount: '฿43,500', detail: 'ยังอยู่ในช่วงเร่งด่วน' },
  { label: 'ยอดสั่งเดลิเวอรี่', amount: '฿78,900', detail: '+6% เมื่อเทียบกับสัปดาห์ก่อน' }
];

const alerts = [
  { id: 'alert-1', title: 'POS โซนสวนอาหาร', detail: 'อุปกรณ์ยังไม่ออนไลน์', time: '09:24 น.' },
  { id: 'alert-2', title: 'ออเดอร์ล่าช้า 3 รายการ', detail: 'ต้องแจ้งทีมครัว', time: '08:52 น.' },
  {
    id: 'alert-3',
    title: 'แก้ไขเมนู',
    detail: 'เมนูซุปเปอร์ฟู้ดได้รับการอนุมัติแล้ว',
    time: '07:15 น.'
  }
];

const toastExamples: { variant: 'info' | 'success' | 'warning'; title: string; description: string; accent?: string }[] = [
  {
    variant: 'success',
    title: 'สำเร็จ',
    description: 'อัปเดตการจำกัดสิทธิ์สำเร็จ',
    accent: 'ระบบอัปเดตแล้ว'
  },
  {
    variant: 'warning',
    title: 'คำเตือน',
    description: 'ผู้ใช้ใหม่ยังไม่ยืนยันตัวตน',
    accent: 'ต้องตรวจสอบ'
  }
];

export function DashboardHome({ currentUser }: { currentUser: SessionWithAuth | null }) {
  const canManageUsers = hasPermission(currentUser?.permissions.permissions, 'user.manage');

  return (
    <main className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">แดชบอร์ดแอดมิน</p>
            <h2 className="text-3xl font-semibold text-slate-900">ภาพรวมระบบวันนี้</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {canManageUsers && (
              <Button intent="secondary" size="sm" asChild>
                <Link href={{ pathname: "/users" }}>จัดการผู้ใช้ POS</Link>
              </Button>
            )}
            <Button size="sm">แจ้งเตือนใหม่</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {revenueSummary.map((item) => (
            <Card key={item.label} className="space-y-3">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-semibold text-slate-900">{item.amount}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">กิจกรรมแจ้งเตือน</p>
              <h3 className="text-lg font-semibold text-slate-900">เหตุการณ์ล่าสุด</h3>
            </div>
            <Button intent="ghost" size="sm">
              ดูทั้งหมด
            </Button>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-500">{alert.time}</p>
                </div>
                <p className="text-sm text-slate-600">{alert.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">การแจ้งเตือนเชิงโต้ตอบ</p>
            <Dialog
              title="POS ตรงซอยทองหล่อยังไม่ตอบสนอง"
              description="ตรวจสอบการเชื่อมต่อตัวอ่านบัตรและสัญญาณ Wi-Fi ก่อนเปิดให้บริการสายใหม่"
              badge="สำคัญ"
              actions={
                <>
                  <Button intent="ghost" size="sm">
                    ดูรายละเอียด
                  </Button>
                  <Button size="sm">แจ้งทีมเทคนิค</Button>
                </>
              }
            />
          </div>
          <div className="space-y-3">
            {toastExamples.map((toast) => (
              <Toast
                key={toast.title}
                variant={toast.variant}
                title={toast.title}
                description={toast.description}
                accent={toast.accent}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">รายการสำคัญ</p>
              <h3 className="text-lg font-semibold text-slate-900">กิจกรรมที่ต้องติดตาม</h3>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            <p>• ตรวจสอบการอนุมัติบทบาท <strong>ผู้จัดการ</strong> 2 ราย</p>
            <p>• กำหนดสิทธิ์ใหม่ให้พนักงานบริการด่วน</p>
            <p>• ยืนยันเหตุการณ์แจ้งเตือนระบบไฟฟ้าพื้นที่ 2</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ช่องทางด่วน</p>
            <h3 className="text-lg font-semibold text-slate-900">จัดการผู้ใช้เร็ว</h3>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            <p>• เพิ่มผู้ใช้ใหม่หรือแก้ไขบทบาทก่อนเปิดร้าน</p>
            <p>• แยกสิทธิ์การใช้งานตามหน่วยงาน เช่น ครัว, โซนบริการ, เดลิเวอรี่</p>
            <p>• ควบคุมสรุปสิทธิ์ให้เฉพาะหน้าแดชบอร์ดหลักหรือรายงาน</p>
          </div>
        </Card>
      </section>
    </main>
  );
}
