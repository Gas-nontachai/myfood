'use client';

import { useMemo, useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, Checkbox, Input } from '@myfood/shared-ui';
import type {
  Category,
  ProductFormState,
  ProductOptionGroup,
  ProductWithRelations,
} from '../../../types';
import {
  MAX_PRODUCT_IMAGE_SIZE_MB,
  PRODUCT_IMAGE_ACCEPT_ATTR
} from '../../../lib/constants/media';
import React from 'react'; 

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

type VariantRow = {
  id: string;
  name: string;
  price: string;
};

type ProductFormProps = {
  categories: Category[];
  optionGroups: ProductOptionGroup[];
  // eslint-disable-next-line no-unused-vars
  formAction: (data: FormData) => void;
  state: ProductFormState;
  mode: 'create' | 'edit';
  product?: ProductWithRelations;
  onDelete?: () => void;
  deleting?: boolean;
};

const createVariantRow = (name = '', price = ''): VariantRow => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name,
  price,
});

export function ProductForm({
  categories,
  optionGroups,
  formAction,
  state,
  product,
  mode,
  onDelete,
  deleting = false,
}: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useVariantPricing, setUseVariantPricing] = useState(
    (product?.priceVariants.length ?? 0) > 0
  );
  
  const [variantRows, setVariantRows] = useState<VariantRow[]>(() => {
    if (product?.priceVariants.length) {
      return product.priceVariants.map((variant) =>
        createVariantRow(
          variant.variant_name ?? '',
          variant.price?.toString() ?? ''
        )
      );
    }
    return [createVariantRow()];
  });

  const selectedCategoryIds = useMemo(
    () => new Set((product?.categories ?? []).map((category) => category.id)),
    [product]
  );

  const selectedOptionGroupIds = useMemo(
    () => new Set((product?.optionGroups ?? []).map((group) => group.id)),
    [product]
  );

  const handleVariantChange = (
    rowId: string,
    field: 'name' | 'price',
    value: string
  ) => {
    setVariantRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [field]: value,
          }
          : row
      )
    );
  };

  const handleAddVariant = () => {
    setVariantRows((prev) => [...prev, createVariantRow()]);
  };

  const handleRemoveVariant = (rowId: string) => {
    setVariantRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const descriptionDefault = product?.description ?? '';

  const formTitle =
    mode === 'create' ? 'สร้างสินค้าใหม่' : `แก้ไขสินค้า: ${product?.name ?? ''}`;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          จัดการสินค้า
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{formTitle}</h1>
      </div>

      <Card className="space-y-6 p-6">
        <form action={formAction} className="space-y-8"  >
          <div className="grid gap-4 lg:grid-cols-2">
            <Input
              id="name"
              name="name"
              label="ชื่อสินค้า"
              helperText="ชื่อที่จะแสดงให้พนักงานขายและลูกค้า"
              defaultValue={product?.name}
              required
            />

            <Input
              id="code"
              name="code"
              label="รหัสสินค้า"
              helperText="ใช้สำหรับค้นหาในระบบ POS"
              defaultValue={product?.code ?? ''}
              placeholder="เช่น BR-001"
            />

            <label className="text-sm font-medium text-slate-900">
              ประเภทสินค้า
              <select
                id="product_type"
                name="product_type"
                defaultValue={product?.product_type ?? ''}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="" disabled>
                  เลือกประเภทสินค้า
                </option>
                {categories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>

            <Input
              id="unit"
              name="unit"
              label="หน่วย"
              helperText="เช่น แก้ว, ชิ้น, เสิร์ฟ"
              defaultValue={product?.unit ?? ''}
            />

            <Input
              id="base_price"
              name="base_price"
              type="number"
              step="0.01"
              min="0"
              label="ราคาพื้นฐาน (THB)"
              helperText="จะใช้เป็นราคาเริ่มต้นหรือเมื่อไม่ได้กำหนดราคาแบบ Variant"
              defaultValue={
                typeof product?.base_price === 'number'
                  ? product.base_price
                  : ''
              }
              required={!useVariantPricing}
            />

            <label className="text-sm font-medium text-slate-900">
              สถานะการขาย
              <select
                id="status"
                name="status"
                defaultValue={product?.status ?? 'active'}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-900"
            >
              คำอธิบายสินค้า
            </label>
            <textarea
              id="description"
              name="description"
              className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="รายละเอียดสำหรับพนักงานหรือโบรชัวร์"
              defaultValue={descriptionDefault}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image_file" className="text-sm font-medium text-slate-900">
              รูปสินค้า
            </label>

            {/* รูปปัจจุบัน (เฉพาะตอนยังไม่เลือกไฟล์ใหม่) */}
            {product?.image_url && !previewUrl && (
              <div className="flex items-center gap-3">
                <Image
                  src={product.image_url}
                  alt={`ตัวอย่างรูป ${product?.name ?? ''}`}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 rounded-lg border border-slate-100 object-cover"
                />
                <span className="text-xs text-slate-500">รูปปัจจุบัน</span>
              </div>
            )}

            {/* ตัวอย่างรูปใหม่ */}
            {previewUrl && (
              <div className="flex items-center gap-3">
                <Image
                  src={previewUrl}
                  alt="ตัวอย่างรูปใหม่"
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 rounded-lg border border-brand-primary/30 object-cover"
                />
                <span className="text-xs text-brand-primary">ตัวอย่างรูปใหม่</span>
              </div>
            )}

            <input
              id="image_file"
              name="image_file"
              type="file"
              accept={PRODUCT_IMAGE_ACCEPT_ATTR}
              onChange={handleImageChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />

            <p className="text-xs text-slate-500">
              รองรับไฟล์ PNG, JPG, HEIC หรือ WebP (สูงสุด {MAX_PRODUCT_IMAGE_SIZE_MB}MB)
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
            <Checkbox
              label="เปิดใช้งานราคาแยกตามขนาด/ตัวเลือก"
              description="เหมาะสำหรับสินค้าที่ต้องกำหนดราคาตาม Size เช่น S/M/L"
              checked={useVariantPricing}
              onChange={(event) => setUseVariantPricing(event.target.checked)}
            />

            {useVariantPricing && (
              <div className="space-y-4">
                {variantRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-100 p-3 md:flex-row"
                  >
                    <Input
                      name="variant_name"
                      label={`ชื่อ Variant ${index + 1}`}
                      placeholder="เช่น Size M"
                      value={row.name}
                      onChange={(event) =>
                        handleVariantChange(row.id, 'name', event.target.value)
                      }
                      required
                    />
                    <Input
                      name="variant_price"
                      label="ราคา (THB)"
                      type="number"
                      step="0.01"
                      min="0"
                      value={row.price}
                      onChange={(event) =>
                        handleVariantChange(row.id, 'price', event.target.value)
                      }
                      required
                    />
                    <Button
                      type="button"
                      intent="ghost"
                      className="self-end text-sm text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveVariant(row.id)}
                      disabled={variantRows.length === 1}
                    >
                      ลบ
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  intent="secondary"
                  size="sm"
                  onClick={handleAddVariant}
                >
                  เพิ่มขนาด/ราคา
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              หมวดหมู่สินค้า
            </p>
            <p className="text-xs text-slate-500">
              เลือกได้หลายหมวดหมู่เพื่อให้พนักงานค้นหาได้ง่าย
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                >
                  <input
                    type="checkbox"
                    name="category_ids"
                    value={category.id}
                    defaultChecked={selectedCategoryIds.has(category.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  {category.name}
                </label>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-slate-500">
                  ยังไม่มีหมวดหมู่สินค้า โปรดสร้างที่หน้า &quot;ประเภทสินค้า&quot;
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              กลุ่มตัวเลือกเพิ่มเติม
            </p>
            <p className="text-xs text-slate-500">
              ผูกสินค้าเข้ากับกลุ่มตัวเลือกเพื่อใช้ซ้ำ เช่น เพิ่มท็อปปิ้ง, เลือกความหวาน
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {optionGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                >
                  <input
                    type="checkbox"
                    name="option_group_ids"
                    value={group.id}
                    defaultChecked={selectedOptionGroupIds.has(group.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span>
                    <span className="font-semibold">{group.name}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      {group.type === 'multi' ? 'เลือกได้หลายตัว' : 'เลือกได้ 1 ตัว'}
                    </span>
                  </span>
                </label>
              ))}
              {optionGroups.length === 0 && (
                <p className="text-sm text-slate-500">
                  ยังไม่มีกลุ่มตัวเลือกในระบบ
                </p>
              )}
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            {mode === 'edit' && onDelete && (
              <Button
                type="button"
                intent="danger"
                onClick={onDelete}
                disabled={deleting}
              >
                ลบสินค้า
              </Button>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit">
                {mode === 'create' ? 'สร้างสินค้า' : 'บันทึก'}
              </Button>
              <Button intent="secondary" type="button" asChild>
                <Link href="/product">ยกเลิก</Link>
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
}
