import { notFound } from 'next/navigation';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';
import { CategoryEditForm } from './CategoryEditForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; 

    const admin = createAdminClient();

    const { data: category } = await admin
        .from('product_category')
        .select('*')
        .eq('id', parseInt(id))
        .single();

    if (!category) {
        notFound();
    }

    const { data: productCategories } = await admin
        .from('product_category')
        .select('id, name')
        .order('id', { ascending: true });

    return (
        <section className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการประเภทสินค้า</p>
                <h1 className="text-3xl font-semibold text-slate-900">
                    แก้ไขประเภทสินค้า: {category.name}
                </h1>
            </div>

            <CategoryEditForm
                category={category}
                productCategories={productCategories ?? []}
            />
        </section>
    );
}
