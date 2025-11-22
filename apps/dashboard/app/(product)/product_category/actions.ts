'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createCategory(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const parent_id = formData.get('parent_id') as string;

  if (!name) {
    return { error: 'กรุณาระบุชื่อประเภทสินค้า' };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('product_category').insert({ name, description, parent_id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/product_category');
  redirect('/product_category?created=true');
}

export async function updateCategory(
  categoryId: number,
  formData: FormData,
) {
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const parent_id = formData.get('parent_id') as string;

  if (!name) {
    return { error: "กรุณาระบุชื่อประเภทสินค้า" };
  }

  const { error: updateError } = await admin
    .from("product_category")
    .update({ name, description ,parent_id})
    .eq("id", categoryId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/product_category");
  revalidatePath(`/product_category/${categoryId}/edit`);

  redirect(`/product_category/${categoryId}/edit?updated=true`);
}

export async function deleteCategory(id: number) {
  const admin = createAdminClient();
  const { error } = await admin.from('product_category').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/product_category');
  redirect('/product_category?deleted=true');
}
