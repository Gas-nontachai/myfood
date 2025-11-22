import { notFound } from 'next/navigation';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';
import { PermissionEditForm } from './PermissionEditForm';

type EditPermissionPageParams = {
    params: Promise<{ id: string }>;
};

export default async function EditPermissionPage({ params }: EditPermissionPageParams) {
    const { id } = await params;
    const admin = createAdminClient();

    const { data: permission } = await admin.from('permissions').select('*').eq('id', parseInt(id)).single();

    if (!permission) {
        notFound();
    }

    return (
        <section className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                <h1 className="text-3xl font-semibold text-slate-900">แก้ไขสิทธิ์: {permission.code}</h1>
            </div>

            <PermissionEditForm permission={permission} />
        </section>
    );
}
