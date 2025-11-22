'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Input, Checkbox } from '@myfood/shared-ui';
import { updateCategory, deleteCategory } from '../../actions';
import type { Category } from '../../../../../types';

type Props = {
    category: Category;
    productCategories: { id: number; name: string }[];
};

export function CategoryEditForm({ category, productCategories }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isSubCategory, setIsSubCategory] = useState(false);

    useEffect(() => {
        setIsSubCategory(!!category.parent_id);
    }, [category.parent_id]);

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const res = await updateCategory(category.id, formData);
            if (res?.error) {
                alert(res.error);
            } else {
                router.push('/product_category');
            }
        });
    };

    const handleDelete = async () => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบประเภทสินค้านี้?')) return;

        startTransition(async () => {
            try {
                await deleteCategory(category.id);
                router.push('/product_category');
            } catch (error: any) {
                alert(error.message);
            }
        });
    };

    return (
        <section className="space-y-6"> 

            <Card className="max-w-2xl p-6 space-y-6">
                <form action={handleSubmit} className="space-y-6">
                    
                    {/* Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-900">
                            ชื่อประเภทสินค้า <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={category.name}
                            required
                        />
                    </div>

                    {/* Checkbox */}
                    <div>
                        <Checkbox
                            label="ประเภทสินค้าย่อย?"
                            description="ประเภทสินค้าย่อยจะถูกจัดกลุ่มภายใต้ประเภทหลัก"
                            checked={isSubCategory}
                            onChange={() => setIsSubCategory(prev => !prev)}
                        />
                    </div>

                    {/* Parent Category */}
                    {isSubCategory && (
                        <div className="space-y-2">
                            <label htmlFor="parent_id" className="text-sm font-medium text-slate-900">
                                เลือกประเภทหลัก
                                </label>

                            <select
                                id="parent_id"
                                name="parent_id"
                                className="w-full rounded-md border p-2"
                                defaultValue={category.parent_id ?? ''}
                                required
                            >
                                <option value="">-- เลือกประเภทหลัก --</option>
                                {productCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-900">
                            คำอธิบาย
                        </label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={category.description ?? ''}
                            placeholder="รายละเอียดเพิ่มเติม"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4">
                        <Button
                            type="button"
                            intent="danger"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            ลบประเภทสินค้า
                        </Button>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={isPending}>
                                บันทึก
                            </Button>

                            <Button type="button" intent="secondary" asChild>
                                <Link href="/product_category">ยกเลิก</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </section>
    );
}
