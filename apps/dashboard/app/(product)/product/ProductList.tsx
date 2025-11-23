'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Toast } from '@myfood/shared-ui';
import { TextSearchInput } from '../../../components/TextSearchInput';
import type { ProductListProps } from '../../../types';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const statusBadges: Record<
  string,
  { className: string; text: string }
> = {
  active: { className: 'bg-emerald-50 text-emerald-700', text: 'Active' },
  inactive: { className: 'bg-slate-100 text-slate-500', text: 'Inactive' },
};

function formatPrice(base: number | null | undefined) {
  if (typeof base !== 'number' || Number.isNaN(base)) return '-';
  return currencyFormatter.format(base);
}

export function ProductList({
  products,
  categories,
  searchParams,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const productTypeOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: { value: string; label: string }[] = [];

    products.forEach((product) => {
      const value = product.product_type;
      if (!value || seen.has(value)) return;
      seen.add(value);

      const label =
        categories.find((category) => String(category.id) === value)?.name ?? value;

      options.push({ value, label });
    });

    return options.sort((a, b) => a.label.localeCompare(b.label, 'th-TH'));
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    });

    return sorted
      .filter((product) => {
        if (statusFilter === 'all') return true;
        return product.status === statusFilter;
      })
      .filter((product) => {
        if (typeFilter === 'all') return true;
        return String(product.product_type) === typeFilter;
      })
      .filter((product) => {
        if (categoryFilter === 'all') return true;
        return product.categories.some(
          (category) => String(category.id) === categoryFilter
        );
      })
      .filter((product) => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(lower) ||
          (product.code ?? '').toLowerCase().includes(lower)
        );
      });
  }, [products, statusFilter, typeFilter, categoryFilter, searchTerm]);

  const inlineAlerts = [] as {
    variant: 'success' | 'info' | 'warning';
    title: string;
    description: string;
  }[];

  if (searchParams?.created === 'true') {
    inlineAlerts.push({
      variant: 'success',
      title: 'สร้างสินค้าสำเร็จ',
      description: 'สินค้าใหม่พร้อมให้ใช้งานในระบบแล้ว',
    });
  }
  if (searchParams?.updated === 'true') {
    inlineAlerts.push({
      variant: 'success',
      title: 'บันทึกข้อมูลสินค้าแล้ว',
      description: 'รายละเอียดสินค้าถูกอัปเดตเรียบร้อย',
    });
  }
  if (searchParams?.deleted === 'true') {
    inlineAlerts.push({
      variant: 'success',
      title: 'ลบสินค้าแล้ว',
      description: 'สินค้าถูกนำออกจากแคตตาล็อก',
    });
  }
  if (searchParams?.error) {
    inlineAlerts.push({
      variant: 'warning',
      title: 'เกิดข้อผิดพลาด',
      description: searchParams.error,
    });
  }

  const imageProps = process.env.NODE_ENV === 'test' ? {} : { unoptimized: true };

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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <TextSearchInput
            name="q"
            placeholder="ค้นหาโดยชื่อหรือรหัสสินค้า"
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}
            aria-label="filter-status"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="filter-type"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">ทุกประเภทสินค้า</option>
            {productTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="filter-category"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">ทุกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                <th className="px-3 py-2">รูป</th>
                <th className="px-3 py-2">สินค้า</th>
                <th className="px-3 py-2">หมวดหมู่</th>
                <th className="px-3 py-2">ราคา</th>
                <th className="px-3 py-2">กลุ่มตัวเลือก</th>
                <th className="px-3 py-2">สถานะ</th>
                <th className="px-3 py-2">อัปเดตล่าสุด</th>
                <th className="px-3 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-3">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={`รูปของ ${product.name}`}
                        width={48}
                        height={48}
                        {...imageProps}
                        className="h-12 w-12 rounded-lg border border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[10px] uppercase tracking-widest text-slate-400">
                        ไม่มีรูป
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-900">{product.name}</div>
                    <p className="text-xs text-slate-500">
                      {product.code ? `รหัส ${product.code}` : 'รหัสยังไม่ตั้ง'} ·{' '}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1 text-xs font-medium text-slate-700">
                      <span
                        className="rounded-full bg-slate-100 px-2 py-0.5"
                      >
                        {categories.find((category) => String(product.product_type) === String(category.id))?.name ?? 'ไม่ระบุประเภทสินค้า'}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    {product.priceVariants.length > 0 ? (
                      <ul className="space-y-1 text-sm text-slate-700">
                        {product.priceVariants.map((variant) => (
                          <li key={variant.id}>
                            {variant.variant_name}: {formatPrice(variant.price)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-700 font-semibold">
                        {formatPrice(product.base_price)}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3 text-sm text-slate-700">
                    {product.optionGroups.length > 0 ? (
                      <ul className="space-y-1">
                        {product.optionGroups.map((group) => (
                          <li key={`${product.id}-${group.id}`}>
                            • {group.name} ({group.type === 'multi' ? 'หลายตัวเลือก' : 'ตัวเลือกเดียว'})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400">ยังไม่มีกลุ่มตัวเลือก</span>
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadges[product.status]?.className ??
                        'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {statusBadges[product.status]?.text ?? product.status}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-xs text-slate-500">
                    {product.updated_at
                      ? dateFormatter.format(new Date(product.updated_at))
                      : '-'}
                  </td>

                  <td className="px-3 py-3 text-sm">
                    <Link
                      href={`/product/${product.id}/edit`}
                      className="text-brand-primary hover:underline"
                    >
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-400">
                    ไม่พบสินค้าที่ตรงกับเงื่อนไข
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
