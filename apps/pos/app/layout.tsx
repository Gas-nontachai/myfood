import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Breadcrumbs } from '@myfood/shared-ui';

export const metadata: Metadata = {
  title: 'MyFood POS Tablet',
  description: 'หน้าจอ POS สำหรับพนักงาน พร้อมเมนูหลักและการแจ้งเตือน'
};

const posBreadcrumbLabels = {
  '/home': 'หน้าหลังล็อกอิน',
  '/loading': 'หน้าจอโหลด',
  '/menu': 'เมนู POS',
  '/login': 'เข้าสู่ระบบพนักงาน'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Breadcrumbs
            labelMap={posBreadcrumbLabels}
            rootLabel="MyFood POS"
            rootHref="/"
            className="mb-6"
          />
          {children}
        </div>
      </body>
    </html>
  );
}
