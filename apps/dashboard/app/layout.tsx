import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { createAdminClient } from '../lib/supabaseAdmin';
import { loadCurrentUser } from '../lib/auth';
import { DashboardShell } from '../components/DashboardShell';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'แดชบอร์ดผู้ดูแลระบบ MyFood',
  description: 'จัดการผู้ใช้ POS, เหตุการณ์ และการแจ้งเตือนในระบบ'
};

// visibility logic moved to ./layoutUtils

export default async function RootLayout({ children }: { children: ReactNode }) {
  const currentUser = await loadCurrentUser();
  const headerList = headers();
  let roleName: string | null = null;

  if (currentUser) {
    const profile = currentUser.profile;

    if (!profile || profile.status !== 'active') {
      redirect('/account-disabled');
    }

    if (profile.role_primary) {
      const admin = createAdminClient();
      const { data: role } = await admin
        .from('roles')
        .select('name')
        .eq('id', profile.role_primary)
        .maybeSingle();
      roleName = role?.name ?? null;
    }

    if (roleName !== 'admin') {
      redirect('/dashboard/no-access');
    }
  }

  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <DashboardShell
          currentUser={currentUser}
          roleName={roleName}
        >
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
