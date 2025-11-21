'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createRole(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name) {
        return { error: 'กรุณาระบุชื่อบทบาท' };
    }

    const admin = createAdminClient();
    const { error } = await admin.from('roles').insert({ name, description });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/roles');
    redirect('/dashboard/roles?created=true');
}

export async function updateRole(roleId: number, prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name) {
        return { error: 'กรุณาระบุชื่อบทบาท' };
    }

    const admin = createAdminClient();
    const { error } = await admin
        .from('roles')
        .update({ name, description })
        .eq('id', roleId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/roles');
    redirect(`/dashboard/roles/${roleId}/edit?updated=true`);
}

export async function updateRolePermissions(roleId: number, permissionIds: number[]) {
    const admin = createAdminClient();

    // 1. Remove old permissions
    const { error: deleteError } = await admin
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

    if (deleteError) {
        throw new Error(deleteError.message);
    }

    // 2. Insert new ones
    if (permissionIds.length > 0) {
        const { error: insertError } = await admin
            .from('role_permissions')
            .insert(
                permissionIds.map((pid) => ({
                    role_id: roleId,
                    permission_id: pid
                }))
            );

        if (insertError) {
            throw new Error(insertError.message);
        }
    }

    revalidatePath(`/dashboard/roles/${roleId}/edit`);
}

export async function deleteRole(id: number) {
    const admin = createAdminClient();
    const { error } = await admin.from('roles').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/roles');
    redirect('/dashboard/roles?deleted=true');
}
