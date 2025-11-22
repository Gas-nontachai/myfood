import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { PermissionsList } from './PermissionsList';

type PermissionsPageParams = {
    searchParams?: Promise<{
        q?: string;
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    }>;
};

export default async function PermissionsPage({ searchParams }: PermissionsPageParams) {
    const resolvedParams = await searchParams;
    const admin = createAdminClient();
    const { data: permissions } = await admin
        .from('permissions')
        .select('*')
        .order('id', { ascending: true });

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                    <h1 className="text-3xl font-semibold text-slate-900">สิทธิ์การใช้งาน</h1>
                </div>
                <Button intent="secondary" asChild>
                    <Link href="/permissions/create">เพิ่มสิทธิ์ใหม่</Link>
                </Button>
            </div>

            <PermissionsList permissions={permissions ?? []} searchParams={resolvedParams} />
        </section>
    );
}
