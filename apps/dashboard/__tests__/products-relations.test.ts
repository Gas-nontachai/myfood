import { buildProductsWithRelations } from '../lib/products/relations';

const baseProduct = {
  base_price: 40,
  code: null,
  created_at: '2024-01-01T00:00:00Z',
  description: null,
  image_url: null,
  status: 'active',
  unit: null,
  updated_at: '2024-01-02T00:00:00Z',
};

describe('buildProductsWithRelations', () => {
  it('attaches categories, parents, option groups and variants', () => {
    const { products, categoriesByProductId } = buildProductsWithRelations({
      products: [
        {
          ...baseProduct,
          id: 99,
          name: 'ชุดอาหารเช้า',
          product_type: '2',
        },
      ],
      categories: [
        { id: 1, name: 'อาหาร', parent_id: null },
        { id: 2, name: 'ชุดเช้า', parent_id: 1 },
      ],
      categoryMap: [{ category_id: 2, product_id: 99 }],
      optionGroups: [
        {
          id: 9,
          name: 'ขนมปัง',
          type: 'single',
          is_required: true,
          max_select: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      optionGroupMap: [{ product_id: 99, group_id: 9 }],
      priceVariants: [
        {
          id: 5,
          product_id: 99,
          variant_name: 'Size M',
          price: 55,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });

    expect(products[0].categories.map((category) => category.name)).toEqual([
      'ชุดเช้า',
      'อาหาร',
    ]);
    expect(products[0].optionGroups).toHaveLength(1);
    expect(products[0].priceVariants).toHaveLength(1);
    expect(categoriesByProductId.get(99)).toHaveLength(2);
  });

  it('deduplicates repeated parent categories', () => {
    const { products } = buildProductsWithRelations({
      products: [
        {
          ...baseProduct,
          id: 1,
          name: 'กาแฟ',
          product_type: 'drink',
        },
      ],
      categories: [
        { id: 1, name: 'ทั้งหมด', parent_id: null },
        { id: 2, name: 'กาแฟเย็น', parent_id: 1 },
        { id: 3, name: 'กาแฟร้อน', parent_id: 1 },
      ],
      categoryMap: [
        { category_id: 2, product_id: 1 },
        { category_id: 3, product_id: 1 },
      ],
      optionGroups: [],
      optionGroupMap: [],
      priceVariants: [],
    });

    const parentCount = products[0].categories.filter(
      (category) => category.id === 1
    ).length;
    expect(parentCount).toBe(1);
  });
});
