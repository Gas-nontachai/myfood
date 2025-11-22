import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { ProductList } from './ProductList';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { buildProductsWithRelations } from '../../../lib/products/relations';
import type { ProductPageParams } from '../../../types';

export default async function ProductsPage({ searchParams }: ProductPageParams) {
  const resolvedParams = await searchParams;
  const admin = createAdminClient();

  const [
    { data: products },
    { data: categoryMap },
    { data: categories },
    { data: priceVariants },
    { data: optionGroupMap },
    { data: optionGroups },
  ] = await Promise.all([
    admin.from('product').select('*').order('created_at', { ascending: false }),

    admin.from('product_category_map').select('product_id, category_id'),

    admin
      .from('product_category')
      .select('id, name, parent_id')
      .order('name', { ascending: true }),

    admin
      .from('product_price_variant')
      .select('id, product_id, variant_name, price, created_at, updated_at')
      .order('price', { ascending: true }),

    admin.from('product_option_group_map').select('product_id, group_id'),

    admin
      .from('product_option_group')
      .select('id, name, type, is_required, max_select, created_at, updated_at')
      .order('name', { ascending: true }),
  ]);

  const { products: productsWithRelations } = buildProductsWithRelations({
    products,
    categories,
    categoryMap,
    optionGroupMap,
    optionGroups,
    priceVariants,
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสินค้า</p>
          <h1 className="text-3xl font-semibold text-slate-900">รายการสินค้า</h1>
        </div>

        <Button intent="secondary" asChild>
          <Link href="/product/create">เพิ่มสินค้าใหม่</Link>
        </Button>
      </div>

      <ProductList
        products={productsWithRelations}
        categories={categories ?? []}
        searchParams={resolvedParams}
      />
    </section>
  );
}
