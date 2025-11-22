'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import {
  deleteMediaAtPath,
  extractMediaPathFromPublicUrl,
  uploadProductImageFile
} from '../../../lib/media';
import type { ProductFormState } from '../../../types';

type ParsedRelations = {
  categoryIds: number[];
  optionGroupIds: number[];
  priceVariants: {
    variant_name: string;
    price: number;
  }[];
};

type FormEntryValue = ReturnType<FormData['get']>;

const productsRedirect = (query?: string) =>
  redirect(`/product${query ? `?${query}` : ''}`);

const DEFAULT_ERROR = 'ไม่สามารถบันทึกข้อมูลสินค้าได้';

function isValidFile(value: FormEntryValue): value is File {
  return value instanceof File && value.size > 0;
}

function parseCurrency(value: string | null): number | null {
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRelations(formData: FormData): ParsedRelations {
  const categoryIds = formData
    .getAll('category_ids')
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  const optionGroupIds = formData
    .getAll('option_group_ids')
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  const variantNames = formData.getAll('variant_name');
  const variantPrices = formData.getAll('variant_price');

  const priceVariants = variantNames
    .map((name, index) => ({
      variant_name: (name ?? '').toString().trim(),
      price: Number(variantPrices[index] ?? 0),
    }))
    .filter(
      (variant) =>
        !!variant.variant_name && Number.isFinite(variant.price) && variant.price >= 0
    );

  return {
    categoryIds,
    optionGroupIds,
    priceVariants,
  };
}

async function syncProductRelations(
  admin: ReturnType<typeof createAdminClient>,
  productId: number,
  relations: ParsedRelations
) {

  const { error: deleteCategoriesError } = await admin
    .from('product_category_map')
    .delete()
    .eq('product_id', productId);

  if (deleteCategoriesError) {
    throw new Error(deleteCategoriesError.message);
  }

  if (relations.categoryIds.length > 0) {
    const { error: insertCategoriesError } = await admin
      .from('product_category_map')
      .insert(
        relations.categoryIds.map((categoryId) => ({
          product_id: productId,
          category_id: categoryId,
        }))
      );

    if (insertCategoriesError) {
      throw new Error(insertCategoriesError.message);
    }
  }

  const { error: deleteOptionGroupError } = await admin
    .from('product_option_group_map')
    .delete()
    .eq('product_id', productId);

  if (deleteOptionGroupError) {
    throw new Error(deleteOptionGroupError.message);
  }

  if (relations.optionGroupIds.length > 0) {
    const { error: insertOptionGroupError } = await admin
      .from('product_option_group_map')
      .insert(
        relations.optionGroupIds.map((groupId) => ({
          product_id: productId,
          group_id: groupId,
        }))
      );

    if (insertOptionGroupError) {
      throw new Error(insertOptionGroupError.message);
    }
  }

  const { error: deleteVariantError } = await admin
    .from('product_price_variant')
    .delete()
    .eq('product_id', productId);

  if (deleteVariantError) {
    throw new Error(deleteVariantError.message);
  }

  if (relations.priceVariants.length > 0) {
    const { error: insertVariantError } = await admin
      .from('product_price_variant')
      .insert(
        relations.priceVariants.map((variant) => ({
          ...variant,
          product_id: productId,
        }))
      );

    if (insertVariantError) {
      throw new Error(insertVariantError.message);
    }
  }
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name = (formData.get('name') ?? '').toString().trim();
  const productType = (formData.get('product_type') ?? '').toString();
  const status = (formData.get('status') ?? 'active').toString();
  const code = (formData.get('code') ?? '').toString().trim();
  const description = (formData.get('description') ?? '').toString().trim();
  const unit = (formData.get('unit') ?? '').toString().trim();
  const basePrice = parseCurrency(formData.get('base_price') as string | null);

  if (!name) {
    return { error: 'กรุณาระบุชื่อสินค้า' };
  }

  if (!productType) {
    return { error: 'กรุณาเลือกประเภทสินค้า' };
  }

  const admin = createAdminClient();

  const imageFile = formData.get('image_file');
  let uploadedImage: { publicUrl: string; path: string } | null = null;

  if (isValidFile(imageFile)) {
    try {
      uploadedImage = await uploadProductImageFile(imageFile);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : DEFAULT_ERROR
      };
    }
  }

  const { data: insertedProduct, error: insertError } = await admin
    .from('product')
    .insert({
      name,
      product_type: productType,
      status,
      code: code || null,
      description: description || null,
      unit: unit || null,
      image_url: uploadedImage?.publicUrl ?? null,
      base_price: basePrice ?? 0,
    })
    .select('id')
    .single();

  if (insertError || !insertedProduct) {
    if (uploadedImage) {
      await deleteMediaAtPath(uploadedImage.path).catch(() => undefined);
    }
    return { error: insertError?.message ?? DEFAULT_ERROR };
  }

  const relations = parseRelations(formData);

  try {
    await syncProductRelations(admin, insertedProduct.id, relations);
  } catch (error) {
    await admin.from('product').delete().eq('id', insertedProduct.id);
    if (uploadedImage) {
      await deleteMediaAtPath(uploadedImage.path).catch(() => undefined);
    }
    return {
      error:
        error instanceof Error ? error.message : DEFAULT_ERROR,
    };
  }

  revalidatePath('/product');
  productsRedirect('created=true');
  return { error: undefined };
}

export async function updateProduct(
  productId: number,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name = (formData.get('name') ?? '').toString().trim();
  const productType = (formData.get('product_type') ?? '').toString();
  const status = (formData.get('status') ?? 'active').toString();
  const code = (formData.get('code') ?? '').toString().trim();
  const description = (formData.get('description') ?? '').toString().trim();
  const unit = (formData.get('unit') ?? '').toString().trim();
  const basePrice = parseCurrency(formData.get('base_price') as string | null);

  if (!name) {
    return { error: 'กรุณาระบุชื่อสินค้า' };
  }

  if (!productType) {
    return { error: 'กรุณาเลือกประเภทสินค้า' };
  }

  const admin = createAdminClient();

  const { data: existingProduct, error: fetchError } = await admin
    .from('product')
    .select('image_url')
    .eq('id', productId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  if (!existingProduct) {
    return { error: 'ไม่พบสินค้าที่ต้องการแก้ไข' };
  }

  const imageFile = formData.get('image_file');
  let uploadedImage: { publicUrl: string; path: string } | null = null;

  if (isValidFile(imageFile)) {
    try {
      uploadedImage = await uploadProductImageFile(imageFile);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : DEFAULT_ERROR
      };
    }
  }

  const { error: updateError } = await admin
    .from('product')
    .update({
      name,
      product_type: productType,
      status,
      code: code || null,
      description: description || null,
      unit: unit || null,
      image_url: uploadedImage?.publicUrl ?? existingProduct.image_url ?? null,
      base_price: basePrice ?? 0,
    })
    .eq('id', productId);

  if (updateError) {
    if (uploadedImage) {
      await deleteMediaAtPath(uploadedImage.path).catch(() => undefined);
    }
    return { error: updateError.message };
  }

  const relations = parseRelations(formData);

  try {
    await syncProductRelations(admin, productId, relations);
  } catch (error) {
    if (uploadedImage) {
      await deleteMediaAtPath(uploadedImage.path).catch(() => undefined);
    }
    return {
      error:
        error instanceof Error ? error.message : DEFAULT_ERROR,
    };
  }

  if (uploadedImage && existingProduct.image_url) {
    const oldPath = extractMediaPathFromPublicUrl(existingProduct.image_url);
    if (oldPath) {
      await deleteMediaAtPath(oldPath).catch(() => undefined);
    }
  }

  revalidatePath('/product');
  revalidatePath(`/product/${productId}/edit`);
  productsRedirect('updated=true');
  return { error: undefined };
}

export async function deleteProduct(productId: number) {
  const admin = createAdminClient();

  const { data: productToDelete } = await admin
    .from('product')
    .select('image_url')
    .eq('id', productId)
    .maybeSingle();

  const { error } = await admin.from('product').delete().eq('id', productId);

  if (error) {
    throw new Error(error.message);
  }

  if (productToDelete?.image_url) {
    const path = extractMediaPathFromPublicUrl(productToDelete.image_url);
    if (path) {
      await deleteMediaAtPath(path).catch(() => undefined);
    }
  }

  revalidatePath('/product');
  productsRedirect('deleted=true');
}
