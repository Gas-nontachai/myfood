import Link from 'next/link';
import { Button } from '@myfood/shared-ui';
import { createAdminClient } from '../../../lib/supabaseAdmin';
import { CategorysList } from './CategoriesList';
import { CategorysPageParams } from '../../../types';

export default async function CategorysPage({ searchParams }: CategorysPageParams) {
    const resolvedParams = await searchParams;
    const admin = createAdminClient();
    const { data: product_category } = await admin
        .from('product_category')
        .select('*')
        .order('id', { ascending: true });

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการประเภทสินค้า</p>
                    <h1 className="text-3xl font-semibold text-slate-900">ประเภทสินค้า</h1>
                </div>
                <Button intent="secondary" asChild>
                    <Link href="/product_category/create">เพิ่มประเภทสินค้าใหม่</Link>
                </Button>
            </div>

            <CategorysList product_category={product_category ?? []} searchParams={resolvedParams} />
        </section>
    );
}
