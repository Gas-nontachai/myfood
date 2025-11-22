"use client";

import { useActionState } from 'react';
import type { Category, ProductOptionGroup } from '../../../../types';
import { ProductForm } from '../ProductForm';
import { createProduct } from '../actions';

type ProductCreatePageProps = {
  categories: Category[];
  optionGroups: ProductOptionGroup[];
};

export default function ProductCreatePage({
  categories,
  optionGroups,
}: ProductCreatePageProps) {
  const [state, formAction] = useActionState(createProduct, { error: '' });

  return (
    <ProductForm
      categories={categories}
      optionGroups={optionGroups}
      formAction={formAction}
      state={state}
      mode="create"
    />
  );
}
