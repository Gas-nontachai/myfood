import { notFound } from 'next/navigation';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';
import { RoleEditForm } from './RoleEditForm';

type EditRolePageParams = {
    params: Promise<{ id: string }>;
};

export default async function EditRolePage({ params }: EditRolePageParams) {
    const { id } = await params;
    const admin = createAdminClient();

    // Fetch role details
    const { data: role } = await admin.from('roles').select('*').eq('id', parseInt(id)).single();

    if (!role) {
        notFound();
    }

    // Fetch all permissions
    const { data: allPermissions } = await admin.from('permissions').select('*').order('code');

    // Fetch permissions assigned to this role
    const { data: rolePermissions } = await admin
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', role.id);

    const assignedPermissionIds = rolePermissions?.map((rp) => rp.permission_id) ?? [];

    return (
        <section className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                <h1 className="text-3xl font-semibold text-slate-900">แก้ไขบทบาท: {role.name}</h1>
            </div>

            <RoleEditForm
                role={role}
                allPermissions={allPermissions ?? []}
                assignedPermissionIds={assignedPermissionIds}
            />
        </section>
    );
}
