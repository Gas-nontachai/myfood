import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { DashboardShell } from '../components/DashboardShell';
import { loadCurrentUser } from '../lib/auth';

export const metadata: Metadata = {
  title: 'MyFood POS Tablet',
  description: 'หน้าจอ POS สำหรับพนักงาน พร้อมเมนูหลักและการแจ้งเตือน'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const currentUser = await loadCurrentUser();

  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <DashboardShell currentUser={currentUser}>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
