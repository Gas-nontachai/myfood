import { Button, Card, Input } from '@myfood/shared-ui';

import { mockCartItems } from '../data/mock-menu';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0
});

export default function CheckoutPage() {
  const totalPrice = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">ยืนยันคำสั่งซื้อ</p>
        <h1 className="text-3xl font-semibold text-gray-900">พร้อมส่งถึงโต๊ะของคุณ</h1>
      </header>

      <Card>
        <p className="text-xs uppercase tracking-[0.35em] text-gray-500">โต๊ะ</p>
        <p className="text-lg font-semibold text-amber-600">โต๊ะ A12</p>
        <p className="text-sm text-gray-500">พนักงานจะเสิร์ฟภายใน 10 นาที</p>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-3">
          {mockCartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {currencyFormatter.format(item.price)} x {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {currencyFormatter.format(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Input
          label="หมายเหตุพิเศษ"
          placeholder="เช่น ไม่ใส่ผัก/แยกน้ำจิ้ม"
          className="bg-white"
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-gray-600">ราคาสุทธิ</p>
          <p className="text-2xl font-semibold text-gray-900">{currencyFormatter.format(totalPrice)}</p>
        </div>
        <Button className="w-full" intent="primary" size="lg">
          ส่งออเดอร์
        </Button>
      </Card>
    </section>
  );
}
