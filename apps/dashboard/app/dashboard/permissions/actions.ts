'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export type ActionState = {
    error?: string;
};

export async function createPermission(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const code = formData.get('code') as string;
    const description = formData.get('description') as string;

    if (!code) {
        return { error: 'กรุณาระบุรหัสสิทธิ์ (Code)' };
    }

    const admin = createAdminClient();
    const { error } = await admin.from('permissions').insert({ code, description });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/permissions');
    redirect('/dashboard/permissions?created=true');
}

export async function updatePermission(id: number, formData: FormData) {
    const code = formData.get('code') as string;
    const description = formData.get('description') as string;

    if (!code) {
        return { error: 'กรุณาระบุรหัสสิทธิ์ (Code)' };
    }

    const admin = createAdminClient();
    const { error } = await admin.from('permissions').update({ code, description }).eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/permissions');
    redirect('/dashboard/permissions?updated=true');
}

export async function deletePermission(id: number) {
    const admin = createAdminClient();
    const { error } = await admin.from('permissions').delete().eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/permissions');
    redirect('/dashboard/permissions?deleted=true');
}
