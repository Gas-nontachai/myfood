import Link from 'next/link';

import { Button, Card } from '@myfood/shared-ui';

import { mockCartItems } from '../data/mock-menu';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0
});

export default function CartPage() {
  const totalPrice = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">ตะกร้าของคุณ</p>
        <h1 className="text-3xl font-semibold text-gray-900">ตรวจสอบรายการก่อนยืนยัน</h1>
      </header>

      <Card className="space-y-5">
        {mockCartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4">
            <div>
              <p className="text-base font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">
                {currencyFormatter.format(item.price)} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-slate-50 px-3 py-2">
              <Button intent="ghost" size="sm">
                -
              </Button>
              <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
              <Button intent="ghost" size="sm">
                +
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-base font-semibold text-gray-600">ราคารวม</p>
          <p className="text-xl font-semibold text-gray-900">{currencyFormatter.format(totalPrice)}</p>
        </div>
        <Button asChild className="w-full" intent="primary" size="lg">
          <Link href="/customer/checkout">ยืนยันคำสั่งซื้อ</Link>
        </Button>
      </Card>
    </section>
  );
}
