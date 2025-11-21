import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Breadcrumbs } from '@myfood/shared-ui';

export const metadata: Metadata = {
  title: 'MyFood Customer',
  description: 'Ordering experience for MyFood customer app.'
};

const customerBreadcrumbLabels = {
  '/menu': 'เมนูหลัก',
  '/orders': 'ติดตามออเดอร์',
  '/customer/start': 'เลือกโต๊ะ / สาขา',
  '/customer/menu': 'เมนูหลัก',
  '/customer/menu/[id]': 'รายละเอียดรายการอาหาร',
  '/customer/cart': 'ตะกร้า',
  '/customer/checkout': 'ยืนยันคำสั่งซื้อ',
  '/customer/status/[orderId]': 'สถานะคำสั่งซื้อ'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-gray-900 antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Breadcrumbs
            labelMap={customerBreadcrumbLabels}
            rootLabel="MyFood (ลูกค้า)"
            rootHref="/"
            className="mb-6"
          />
          {children}
        </div>
      </body>
    </html>
  );
}
