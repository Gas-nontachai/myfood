"use client";

import { Button } from '@myfood/shared-ui';
import { formatCurrency } from '@myfood/shared-utils';
import { useEffect } from 'react';
import { initAnalytics } from '../lib/observability';

const tickets = [
  { id: '401', table: 'T4', items: 3, total: 4200, status: 'Pending' },
  { id: '402', table: 'T1', items: 5, total: 6800, status: 'Preparing' },
  { id: '403', table: 'Pickup', items: 2, total: 2700, status: 'Ready' }
];

export default function PosPage() {
  useEffect(() => {
    initAnalytics({ app: 'pos' });
  }, []);

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-gray-400">Service</p>
          <h1 className="text-3xl font-semibold text-white">Tonight&apos;s orders</h1>
        </div>
        <div className="flex gap-3">
          <Button intent="primary">New table</Button>
          <Button intent="secondary">Clock in</Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="space-y-3 rounded-2xl bg-gray-800 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-gray-400">Order #{ticket.id}</p>
                <p className="text-xl font-semibold text-white">{ticket.table}</p>
              </div>
              <span className="rounded-full bg-gray-700 px-3 py-1 text-xs uppercase text-gray-200">
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-300">{ticket.items} items</p>
            <p className="text-xl font-semibold text-brand-accent">{formatCurrency(ticket.total)}</p>
            <div className="flex gap-3">
              <Button size="sm" intent="secondary" className="flex-1">
                Send to kitchen
              </Button>
              <Button size="sm" className="flex-1">
                Close
              </Button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
