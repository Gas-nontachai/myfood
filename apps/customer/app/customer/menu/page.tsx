import Link from 'next/link';

import { Button, Card } from '@myfood/shared-ui';

import { mockMenuItems } from '../data/mock-menu';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0
});

const categories = ['อาหารจานเดียว', 'เครื่องดื่ม', 'ของหวาน'];

export default function MenuListingPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">เมนูวันนี้</p>
        <h1 className="text-3xl font-semibold text-gray-900">เล่มเมนูแนะนำ</h1>
        <p className="text-sm text-gray-600">
          สำรวจอาหาร เครื่องดื่ม และของหวานที่ปรุงสดใหม่ทุกวัน
        </p>
      </header>

      <div className="space-y-8">
        {categories.map((category) => {
          const items = mockMenuItems.filter((item) => item.category === category);
          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{category}</p>
                  <h2 className="text-lg font-semibold text-gray-900">เมนูแนะนำแผนก {category}</h2>
                </div>
                <Button size="sm" intent="ghost">
                  ดูทั้งหมด
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <Card key={item.id} className="space-y-3">
                    <div className="h-36 w-full rounded-xl bg-gradient-to-br from-amber-100 via-rose-50 to-slate-100">
                      <div className="flex h-full flex-col items-center justify-center text-sm font-semibold text-gray-600">
                        <span className="text-xl text-amber-600">{item.imageLabel}</span>
                        <span className="text-xs">ภาพจำลอง</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm font-semibold text-amber-600">{currencyFormatter.format(item.price)}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{item.category}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <Button asChild intent="secondary" size="sm">
                      <Link href={`/customer/menu/${item.id}`}>ดูรายละเอียด</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
