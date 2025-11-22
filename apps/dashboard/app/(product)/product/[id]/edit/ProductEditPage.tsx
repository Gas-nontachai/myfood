"use client";

import { useActionState, useTransition } from 'react';
import type {
  Category,
  ProductOptionGroup,
  ProductWithRelations,
} from '../../../../../types';
import { ProductForm } from '../../ProductForm';
import { deleteProduct, updateProduct } from '../../actions';

type ProductEditPageProps = {
  product: ProductWithRelations;
  categories: Category[];
  optionGroups: ProductOptionGroup[];
};

export default function ProductEditPage({
  product,
  categories,
  optionGroups,
}: ProductEditPageProps) {
  const updateAction = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateAction, { error: '' });
  const [isDeleting, startDeleting] = useTransition();

  const deleteAction = deleteProduct.bind(null, product.id);

  const handleDelete = () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;
    startDeleting(() => {
      deleteAction();
    });
  };

  return (
    <ProductForm
      categories={categories}
      optionGroups={optionGroups}
      formAction={formAction}
      state={state}
      product={product}
      mode="edit"
      onDelete={handleDelete}
      deleting={isDeleting}
    />
  );
}
