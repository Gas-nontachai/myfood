import { Button, Card } from '@myfood/shared-ui';

const navigation: { label: string; description: string; intent: 'primary' | 'secondary' | 'ghost' }[] = [
  { label: 'สร้างออเดอร์', description: 'เปิดคิวใหม่', intent: 'primary' },
  { label: 'ออเดอร์ปัจจุบัน', description: 'ดูสถานะออเดอร์', intent: 'secondary' },
  { label: 'สรุปรายวัน', description: 'ดูยอดรวมและสรุปเงินสด', intent: 'ghost' }
];

const currentOrders = [
  { id: 'OD-1021', table: 'โต๊ะ 5', status: 'กำลังเตรียม', total: '฿1,280' },
  { id: 'OD-1022', table: 'Delivery C', status: 'รอจัดส่ง', total: '฿890' },
  { id: 'OD-1023', table: 'โต๊ะ VIP', status: 'รอชำระเงิน', total: '฿2,150' }
];

export default function PosHomePage() {
  return (
    <main className="space-y-10">
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">พนักงาน</p>
            <h1 className="text-2xl font-semibold text-slate-900">นัด (พนักงานหน้าร้าน)</h1>
            <p className="text-sm text-slate-600">บทบาท: พนักงานบริการ</p>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <p>เข้าสู่ระบบล่าสุด: 08:40 น.</p>
            <p>สถานะ: พร้อมรับออเดอร์</p>
          </div>
        </Card>
        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">เมนูทางลัด</p>
          <div className="space-y-3">
            {navigation.map((item) => (
              <div key={item.label} className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <Button size="sm" intent={item.intent}>
                    {item.label}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">สรุปประจำวันที่โต๊ะ</p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>เมนูแนะนำวันนี้: 4 รายการ</p>
            <p>สถานะอุปกรณ์: เชื่อมต่อ 6/6</p>
            <p>เวลาเปิดร้าน: 09:00 น. – 23:00 น.</p>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ออเดอร์</p>
            <h2 className="text-2xl font-semibold text-slate-900">ออเดอร์ปัจจุบัน</h2>
          </div>
          <Button size="sm">รีเฟรช</Button>
        </div>
        <div className="space-y-3">
          {currentOrders.map((order) => (
            <Card key={order.id} className="rounded-3xl border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                  <p className="text-xs text-slate-500">{order.table}</p>
                </div>
                <p className="text-xs text-slate-500">สถานะ: {order.status}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <p>ยอดรวม: {order.total}</p>
                <Button size="sm" intent="secondary">
                  ดูรายละเอียด
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
