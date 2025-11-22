import { createAdminClient } from '../../../../lib/supabaseAdmin';
import CreateCategoryPage from './CreateCategoryPage';

export default async function CreateCategory() {
    const admin = createAdminClient();

    const { data: categories } = await admin
        .from('product_category')
        .select('id, name')
        .order('id', { ascending: true });

    return <CreateCategoryPage categories={categories ?? []} />;
}
