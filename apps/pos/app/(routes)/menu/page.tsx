import { Button } from '@myfood/shared-ui';
import { formatCurrency } from '@myfood/shared-utils';

const items = [
  { id: '1', name: 'House Salad', price_cents: 900, stock: 'In stock' },
  { id: '2', name: 'Prime Ribeye', price_cents: 3200, stock: 'Low' },
  { id: '3', name: 'Vanilla Cheesecake', price_cents: 1100, stock: '86ed' }
];

export default function MenuEditor() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-gray-400">Menu</p>
          <h2 className="text-2xl font-semibold text-white">Tonight&apos;s availability</h2>
        </div>
        <Button size="sm">Quick edit</Button>
      </header>
      <div className="space-y-3 rounded-2xl bg-gray-800 p-6 shadow-lg">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="text-xs text-gray-400">{item.stock}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-brand-accent">
                {formatCurrency(item.price_cents)}
              </p>
              <Button intent="secondary" size="sm">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
