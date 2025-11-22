"use client";

import Link from 'next/link';
import { Button, Card, Input, Checkbox } from '@myfood/shared-ui';
import { createCategory } from '../actions';
import { useState, useActionState } from "react";

type Props = {
    categories: { id: number; name: string }[];
};

export default function CreateCategoryPage({ categories }: Props) {
    const [state, formAction] = useActionState(createCategory, { error: '' });
    const [isSubCategory, setIsSubCategory] = useState(false);

    return (
        <section className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการประเภทสินค้า</p>
                <h1 className="text-3xl font-semibold text-slate-900">สร้างประเภทสินค้าใหม่</h1>
            </div>

            <Card className="max-w-2xl p-6 space-y-6">
                <form action={formAction} className="space-y-6">

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-900">
                            ชื่อประเภทสินค้า <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="เช่น เครื่องดื่ม, ของหวาน"
                            required
                        />
                    </div>

                    <div>
                        <Checkbox
                            label="ประเภทสินค้าย่อย?"
                            description="ประเภทสินค้าย่อยจะถูกจัดกลุ่มภายใต้ประเภทหลัก"
                            checked={isSubCategory}
                            onChange={() => setIsSubCategory(prev => !prev)}
                        />
                    </div>

                    {isSubCategory && (
                        <div className="space-y-2">
                            <label htmlFor="parent_id" className="text-sm font-medium text-slate-900">
                                เลือกประเภทหลัก
                            </label>

                            <select
                                id="parent_id"
                                name="parent_id"
                                className="w-full rounded-md border p-2"
                                required={isSubCategory}
                            >
                                <option value="">-- เลือกประเภทหลัก --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-900">
                            คำอธิบาย
                        </label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="รายละเอียดเพิ่มเติม"
                        />
                    </div>

                    {state.error && (
                        <p className="text-sm text-red-600">{state.error}</p>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit">
                            บันทึก
                        </Button>

                        <Button type="button" intent="secondary" asChild>
                            <Link href="/product_category">ยกเลิก</Link>
                        </Button>
                    </div>

                </form>
            </Card>
        </section>
    );
}
