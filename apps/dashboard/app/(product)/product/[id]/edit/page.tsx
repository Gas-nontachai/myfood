import { notFound } from 'next/navigation';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';
import { toNumberOrNull } from '../../../../../lib/utils/number';
import ProductEditPage from './ProductEditPage';
import type {
  Category,
  ProductOptionGroup,
  ProductPriceVariant,
  ProductWithRelations,
} from '../../../../../types';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    notFound();
  }

  const admin = createAdminClient();

  const [
    { data: product },
    { data: categories },
    { data: optionGroups },
    { data: categoryMap },
    { data: optionGroupMap },
    { data: priceVariants },
  ] = await Promise.all([
    admin.from('product').select('*').eq('id', productId).maybeSingle(),
    admin.from('product_category').select('id, name').order('name', { ascending: true }),
    admin
      .from('product_option_group')
      .select('id, name, type, is_required, max_select, created_at, updated_at')
      .order('name', { ascending: true }),
    admin
      .from('product_category_map')
      .select('category_id')
      .eq('product_id', productId),
    admin
      .from('product_option_group_map')
      .select('group_id')
      .eq('product_id', productId),
    admin
      .from('product_price_variant')
      .select('id, product_id, variant_name, price, created_at, updated_at')
      .eq('product_id', productId)
      .order('price', { ascending: true }),
  ]);

  if (!product) {
    notFound();
  }

  const categoryById = new Map(
    (categories ?? []).flatMap((category) => {
      const id = toNumberOrNull(category.id);
      return id === null ? [] : [[id, category] as const];
    })
  );
  const optionGroupById = new Map(
    (optionGroups ?? []).flatMap((group) => {
      const id = toNumberOrNull(group.id);
      return id === null ? [] : [[id, group] as const];
    })
  );

  const selectedCategories: Category[] = (categoryMap ?? [])
    .map((entry) => {
      const categoryId = toNumberOrNull(entry.category_id);
      return categoryId === null ? null : categoryById.get(categoryId) ?? null;
    })
    .filter((category): category is Category => Boolean(category));

  const selectedOptionGroups: ProductOptionGroup[] = (optionGroupMap ?? [])
    .map((entry) => {
      const groupId = toNumberOrNull(entry.group_id);
      return groupId === null ? null : optionGroupById.get(groupId) ?? null;
    })
    .filter((group): group is ProductOptionGroup => Boolean(group));

  const variants: ProductPriceVariant[] = priceVariants ?? [];

  const productWithRelations: ProductWithRelations = {
    ...product,
    categories: selectedCategories,
    optionGroups: selectedOptionGroups,
    priceVariants: variants,
  };

  return (
    <ProductEditPage
      product={productWithRelations}
      categories={categories ?? []}
      optionGroups={optionGroups ?? []}
    />
  );
}
