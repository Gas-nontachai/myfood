import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { DashboardShell } from '../components/DashboardShell';
import { loadCurrentUser } from '../lib/auth';

export const metadata: Metadata = {
  title: 'แดชบอร์ดผู้ดูแลระบบ MyFood',
  description: 'จัดการผู้ใช้ POS, เหตุการณ์ และการแจ้งเตือนในระบบ',
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
