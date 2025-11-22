'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Toast } from '@myfood/shared-ui';
import { TextSearchInput } from '../../../components/TextSearchInput';
import { CategorysListProps } from '../../../types';
import React from 'react';
 
function getCategoriesWithParents(allCategories: any[], matched: any[]) {
    const map = new Map(allCategories.map(c => [c.id, c]));
    const result = new Map();

    function includeWithParents(cat: any) {
        if (!result.has(cat.id)) {
            result.set(cat.id, cat);
            if (cat.parent_id) {
                const parent = map.get(cat.parent_id);
                if (parent) includeWithParents(parent);
            }
        }
    }

    matched.forEach(includeWithParents);

    return Array.from(result.values());
}
 
function buildCategoryTree(categories: any[]) {
    const map = new Map();
    categories.forEach(c => map.set(c.id, { ...c, children: [] }));

    const roots: any[] = [];

    categories.forEach(c => {
        if (c.parent_id) {
            const parent = map.get(c.parent_id);
            if (parent) parent.children.push(map.get(c.id));
        } else {
            roots.push(map.get(c.id));
        }
    });

    return roots;
}
 
function renderCategoryRow(category: any, level = 0) {
    return (
        <React.Fragment key={category.id}>
            <tr className="border-t border-slate-100">
                <td className="px-3 py-3 text-slate-500">{category.id}</td>

                <td className="px-3 py-3 font-semibold text-slate-900">
                    <div style={{ marginLeft: `${level * 20}px` }}>
                        {level > 0 && (
                            <span className="text-slate-400 mr-1">↳</span>
                        )}
                        {category.name}
                    </div>
                </td>

                <td className="px-3 py-3 text-slate-600">
                    {category.description || "-"}
                </td>

                <td className="px-3 py-3">
                    <Link
                        href={`/product_category/${category.id}/edit`}
                        className="text-sm text-brand-primary hover:underline"
                    >
                        แก้ไข
                    </Link>
                </td>
            </tr>

            {/* Render children recursively */}
            {category.children.map((child: any) =>
                renderCategoryRow(child, level + 1)
            )}
        </React.Fragment>
    );
}
 
export function CategorysList({ product_category, searchParams }: CategorysListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const matched = product_category.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCategorys = getCategoriesWithParents(product_category, matched);

    const categoryTree = buildCategoryTree(filteredCategorys);

    const inlineAlerts = [] as {
        variant: 'success' | 'info' | 'warning';
        title: string;
        description: string;
    }[];

    if (searchParams?.created === 'true') {
        inlineAlerts.push({
            variant: 'success',
            title: 'สร้างประเภทสินค้าสำเร็จ',
            description: 'ประเภทสินค้าใหม่พร้อมใช้งานแล้ว'
        });
    }
    if (searchParams?.updated === 'true') {
        inlineAlerts.push({
            variant: 'success',
            title: 'อัปเดตประเภทสินค้าสำเร็จ',
            description: 'ข้อมูลประเภทสินค้าได้รับการปรับปรุงแล้ว'
        });
    }
    if (searchParams?.deleted === 'true') {
        inlineAlerts.push({
            variant: 'success',
            title: 'ลบประเภทสินค้าสำเร็จ',
            description: 'ประเภทสินค้าถูกลบออกจากระบบแล้ว'
        });
    }
    if (searchParams?.error) {
        inlineAlerts.push({
            variant: 'warning',
            title: 'เกิดข้อผิดพลาด',
            description: searchParams.error
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {inlineAlerts.map((toast) => (
                    <Toast
                        key={toast.title}
                        variant={toast.variant}
                        title={toast.title}
                        description={toast.description}
                    />
                ))}
            </div>

            <Card className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row">
                    <TextSearchInput
                        name="q"
                        placeholder="ค้นหาชื่อประเภทสินค้า"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">ชื่อประเภทสินค้า</th>
                                <th className="px-3 py-2">คำอธิบาย</th>
                                <th className="px-3 py-2">จัดการ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categoryTree.length > 0 ? (
                                categoryTree.map(cat =>
                                    renderCategoryRow(cat)
                                )
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                                        ไม่พบข้อมูลประเภทสินค้า
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
