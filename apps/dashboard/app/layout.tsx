import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Breadcrumbs } from '@myfood/shared-ui';
import { AuthStateProvider } from '../components/AuthStateProvider';
import { LogoutButton } from '../components/LogoutButton';
import { AdminHeaderProfile } from '../components/AdminHeaderProfile';

export const metadata: Metadata = {
  title: 'แดชบอร์ดผู้ดูแลระบบ MyFood',
  description: 'จัดการผู้ใช้ POS, เหตุการณ์ และการแจ้งเตือนในระบบ'
};

const dashboardBreadcrumbLabels = {
  '/dashboard': 'ภาพรวมระบบ',
  '/dashboard/users': 'จัดการผู้ใช้',
  '/dashboard/users/create': 'สร้างผู้ใช้ใหม่',
  '/dashboard/users/[id]': 'โปรไฟล์ผู้ใช้',
  '/dashboard/users/[id]/edit': 'แก้ไขบัญชี',
  '/dashboard/no-access': 'สิทธิ์ไม่เพียงพอ',
  '/dashboard/login': 'เข้าสู่ระบบแอดมิน',
  '/dashboard/account-disabled': 'บัญชีถูกระงับ',
  '/reports': 'รายงานประจำสัปดาห์',
  '/users': 'รายชื่อผู้ใช้ POS',
  '/users/[id]/edit': 'แก้ไขผู้ใช้ POS'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">MyFood</p>
              <h1 className="text-3xl font-semibold text-slate-900">ศูนย์ควบคุมแอดมิน</h1>
              <AdminHeaderProfile />
            </div>
            <LogoutButton />
          </header>
          <Breadcrumbs
            labelMap={dashboardBreadcrumbLabels}
            rootLabel="ศูนย์ควบคุมแอดมิน"
            rootHref="/dashboard"
            className="mb-6"
          />
          <AuthStateProvider>{children}</AuthStateProvider>
        </div>
      </body>
    </html>
  );
}
