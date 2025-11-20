import { formatCurrency } from '@myfood/shared-utils';
import { Button } from '@myfood/shared-ui';

const menu = [
  { id: '1', name: 'Spicy Tuna Tartare', price_cents: 1550, category: 'Starters' },
  { id: '2', name: 'Handmade Tagliatelle', price_cents: 1850, category: 'Pasta' },
  { id: '3', name: 'Roasted Branzino', price_cents: 2350, category: 'Mains' }
];

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Today&apos;s menu</p>
        <h2 className="text-3xl font-semibold text-gray-900">Favorites</h2>
        <p className="text-sm text-gray-600">Curated by Chef Maya for the dinner service.</p>
      </header>
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        {menu.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="text-base font-semibold text-gray-900">{item.name}</p>
              <p className="text-xs uppercase text-gray-500">{item.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-brand-secondary">
                {formatCurrency(item.price_cents)}
              </span>
              <Button size="sm">Add</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
