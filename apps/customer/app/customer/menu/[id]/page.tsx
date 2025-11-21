import type { MenuItem } from '../../data/mock-menu';

import { Button, Card } from '@myfood/shared-ui';

import { mockMenuItems } from '../../data/mock-menu';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0
});

interface MenuDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { id } = await params;
  const dish: MenuItem = mockMenuItems.find((item) => item.id === id) ?? mockMenuItems[0];

  return (
    <section className="space-y-6">
      <Card className="space-y-4">
        <div className="h-64 w-full rounded-2xl bg-gradient-to-br from-amber-100 via-pink-50 to-slate-100">
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-600">
            <p className="text-3xl font-semibold text-amber-600">{dish.imageLabel}</p>
            <p className="text-xs text-gray-500">ภาพจำลอง</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{dish.category}</p>
          <h1 className="text-2xl font-semibold text-gray-900">{dish.name}</h1>
          <p className="text-base font-semibold text-amber-600">{currencyFormatter.format(dish.price)}</p>
          <p className="text-sm text-gray-600">{dish.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2">
            <Button intent="ghost" size="sm">
              -
            </Button>
            <span className="text-sm font-semibold text-gray-900">1</span>
            <Button intent="ghost" size="sm">
              +
            </Button>
          </div>
          <p className="text-base font-semibold text-gray-900">จำนวน 1</p>
        </div>
        <Button className="w-full" intent="primary">
          เพิ่มลงตะกร้า
        </Button>
      </Card>
    </section>
  );
}
