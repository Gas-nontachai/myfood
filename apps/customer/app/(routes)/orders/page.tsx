const orders = [
  { id: 'order-123', status: 'In progress', eta: '6 min' },
  { id: 'order-122', status: 'Served', eta: 'Delivered' }
];

export default function OrdersPage() {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Order status</p>
        <h2 className="text-2xl font-semibold text-gray-900">Track your table</h2>
      </header>
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">#{order.id}</p>
              <p className="text-xs text-gray-500">{order.status}</p>
            </div>
            <span className="text-sm font-semibold text-brand-secondary">{order.eta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
