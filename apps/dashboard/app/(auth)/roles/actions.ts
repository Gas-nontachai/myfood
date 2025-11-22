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

    revalidatePath('/roles');
    redirect('/roles?created=true');
}

export async function updateRoleAndPermissions(
  roleId: number,
  formData: FormData,
  permissionIds: number[]
) {
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { error: "กรุณาระบุชื่อบทบาท" };
  }

  const { error: updateError } = await admin
    .from("roles")
    .update({ name, description })
    .eq("id", roleId);

  if (updateError) {
    return { error: updateError.message };
  }

  const { error: deleteError } = await admin
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  if (permissionIds.length > 0) {
    const { error: insertError } = await admin
      .from("role_permissions")
      .insert(
        permissionIds.map((pid) => ({
          role_id: roleId,
          permission_id: pid,
        }))
      );

    if (insertError) return { error: insertError.message };
  }

  revalidatePath("/roles");
  revalidatePath(`/roles/${roleId}/edit`);

  redirect(`/roles/${roleId}/edit?updated=true`);
}

export async function deleteRole(id: number) {
    const admin = createAdminClient();
    const { error } = await admin.from('roles').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/roles');
    redirect('/roles?deleted=true');
}
