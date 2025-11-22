import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { RolesList } from './RolesList';

type RolesPageParams = {
    searchParams?: Promise<{
        q?: string;
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    }>;
};

export default async function RolesPage({ searchParams }: RolesPageParams) {
    const resolvedParams = await searchParams;
    const admin = createAdminClient();
    const { data: roles } = await admin
        .from('roles')
        .select('*')
        .order('id', { ascending: true });

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                    <h1 className="text-3xl font-semibold text-slate-900">บทบาทผู้ใช้งาน</h1>
                </div>
                <Button intent="secondary" asChild>
                    <Link href="/dashboard/roles/create">เพิ่มบทบาทใหม่</Link>
                </Button>
            </div>

            <RolesList roles={roles ?? []} searchParams={resolvedParams} />
        </section>
    );
}
