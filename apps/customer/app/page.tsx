"use client";

import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { formatCurrency } from '@myfood/shared-utils';
import { useEffect } from 'react';
import { initAnalytics } from '../lib/observability';

const featured = [
  { name: 'Wood-Fired Margherita Pizza', price: 1799, description: 'San Marzano, basil, fior di latte' },
  { name: 'Charred Octopus', price: 1450, description: 'Smoked paprika aioli, lemon' },
  { name: 'Seasonal Burrata', price: 1200, description: 'Heirloom tomatoes, basil oil' }
];

export default function Page() {
  useEffect(() => {
    initAnalytics({ app: 'customer' });
  }, []);

  return (
    <main className="space-y-8">
      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-secondary">MyFood</p>
        <h1 className="text-4xl font-semibold leading-tight text-gray-900">
          A better dine-in ordering experience.
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Browse, order, and pay without waiting. Built for hospitality teams that care about guest
          experience.
        </p>
        <div className="flex gap-3">
          <Button asChild intent="primary">
            <Link href="/menu">Start an order</Link>
          </Button>
          <Button intent="secondary">Call server</Button>
        </div>
      </header>

      <section className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-3">
        {featured.map((item) => (
          <article key={item.name} className="space-y-2 rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <span className="text-sm font-semibold text-brand-secondary">
                {formatCurrency(item.price)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
            <Button size="sm">Add to order</Button>
          </article>
        ))}
      </section>
    </main>
  );
}
