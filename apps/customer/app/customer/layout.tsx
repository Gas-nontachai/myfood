import type { ReactNode } from 'react';

import CustomerBottomNav from '@/components/customer-bottom-nav';
import CustomerHeader from '@/components/customer-header';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CustomerHeader />
      <main className="flex-1 w-full px-4 pb-28 pt-4">{children}</main>
      <CustomerBottomNav />
    </div>
  );
}
