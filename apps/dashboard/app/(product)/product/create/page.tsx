import { createAdminClient } from '../../../../lib/supabaseAdmin';
import ProductCreatePage from './ProductCreatePage';

export default async function CreateProduct() {
  const admin = createAdminClient();

  const [{ data: categories }, { data: optionGroups }] = await Promise.all([
    admin.from('product_category').select('id, name').order('name', { ascending: true }),
    admin
      .from('product_option_group')
      .select('id, name, type, is_required, max_select, created_at, updated_at')
      .order('name', { ascending: true }),
  ]);

  return (
    <ProductCreatePage
      categories={categories ?? []}
      optionGroups={optionGroups ?? []}
    />
  );
}
