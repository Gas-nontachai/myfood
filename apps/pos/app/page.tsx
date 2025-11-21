import Link from 'next/link';
import { Button, Card } from '@myfood/shared-ui';

export default function PosLandingPage() {
  return (
    <main className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">MyFood POS</p>
        <h1 className="text-4xl font-semibold text-slate-900">ระบบ POS สำหรับพนักงาน</h1>
        <p className="text-sm text-slate-600">
          ออกแบบมาสำหรับการบริการหน้าร้านและเดลิเวอรี่ ใช้งานง่าย พร้อมเมนูหลักและสถานะของออเดอร์แบบเรียลไทม์
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">เข้าสู่ระบบพนักงาน</Link>
          </Button>
          <Button intent="secondary" asChild>
            <Link href="/loading">แสดงสถานะการโหลดระบบ</Link>
          </Button>
          <Button intent="ghost" asChild>
            <Link href="/home">เมนูหลักหลังล็อกอิน</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">เมนูหลักหลังล็อกอิน</h2>
          <p className="text-sm text-slate-600">จะแสดงชื่อพนักงานและบทบาท พร้อมปุ่มเมนูที่สำคัญที่สุด</p>
          <div className="grid gap-3">
            {['สร้างออเดอร์', 'ออเดอร์ปัจจุบัน', 'สรุปรายวัน'].map((label) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                {label}
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">หน้าจอโหลด</h2>
          <p className="text-sm text-slate-600">
            มีภาพรวมของสถานะอุปกรณ์และแบนด์วิดท์ พร้อมการเรนเดอร์หน้าจอโหลดอย่างเรียบง่าย
          </p>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            ตัวอย่าง: เชื่อมต่ออุปกรณ์สำเร็จ 5/6, รอการตอบรับจากครัว
          </div>
        </Card>
      </section>
    </main>
  );
}
