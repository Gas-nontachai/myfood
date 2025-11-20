"use client";

import { Button } from '@myfood/shared-ui';
import { formatCurrency, formatDate } from '@myfood/shared-utils';
import { useEffect } from 'react';
import { initAnalytics } from '../lib/observability';

const revenueToday = [
  { label: 'Dine-in', amount: 124_300, change: '+12%' },
  { label: 'Pickup', amount: 34_800, change: '+6%' },
  { label: 'Delivery', amount: 62_500, change: '-3%' }
];

const alerts = [
  { id: 'a1', title: 'POS offline in Patio', time: '2023-10-22T18:45:00Z' },
  { id: 'a2', title: '86ed: Vanilla Cheesecake', time: '2023-10-22T18:15:00Z' }
];

export default function DashboardPage() {
  useEffect(() => {
    initAnalytics({ app: 'dashboard' });
  }, []);

  return (
    <main className="space-y-8">
      <section>
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Today&apos;s revenue</h2>
          <Button size="sm">Export</Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {revenueToday.map((bucket) => (
            <div key={bucket.label} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">{bucket.label}</p>
              <p className="text-3xl font-semibold text-slate-900">
                {formatCurrency(bucket.amount)}
              </p>
              <p className="text-xs text-emerald-600">{bucket.change} vs yesterday</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Live alerts</h3>
            <Button size="sm" intent="secondary">
              Resolve all
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(alert.time)}</p>
                </div>
                <Button size="sm">View</Button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Deployment status</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Customer app: ready on https://myfood.com</li>
            <li>POS: ready on https://pos.myfood.com</li>
            <li>Admin: ready on https://admin.myfood.com</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
