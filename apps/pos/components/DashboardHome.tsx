import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { hasPermission } from '../lib/permissions';
import type { SessionWithAuth } from '../lib/auth';

export function DashboardHome({ currentUser }: { currentUser: SessionWithAuth | null }) {
  const canManageUsers = hasPermission(currentUser?.permissions.permissions, 'user.manage');

  return (
    <main className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Example</p>
            <h2 className="text-3xl font-semibold text-slate-900">POS</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {canManageUsers && (
              <Button intent="secondary" size="sm" asChild>
                <Link href={{ pathname: "/users" }}>จัดการผู้ใช้ POS</Link>
              </Button>
            )} 
          </div>
        </div>
      </section>

    </main>
  );
}
