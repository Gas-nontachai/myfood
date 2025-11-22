import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductList } from '../app/(product)/product/ProductList';
import type { ProductWithRelations } from '../types';

const categories = [
  { id: 1, name: 'เครื่องดื่ม' },
  { id: 2, name: 'ขนมปัง' },
];

const baseProduct = {
  code: 'MK-001',
  created_at: '2024-01-01T00:00:00Z',
  description: null,
  image_url: null,
  unit: 'แก้ว',
  updated_at: '2024-01-02T00:00:00Z',
} as const;

const mockProducts: ProductWithRelations[] = [
  {
    ...baseProduct,
    id: 1,
    name: 'โกโก้เย็น',
    product_type: '1',
    status: 'active',
    base_price: 30,
    image_url: 'https://example.com/cocoa.webp',
    categories: [categories[0]],
    optionGroups: [],
    priceVariants: [
      {
        id: 10,
        product_id: 1,
        variant_name: 'Size M',
        price: 35,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    ...baseProduct,
    id: 2,
    name: 'ขนมปังปิ้ง',
    product_type: '2',
    status: 'inactive',
    base_price: 25,
    categories: [categories[1]],
    optionGroups: [
      {
        id: 5,
        name: 'เพิ่มท็อปปิ้ง',
        type: 'multi',
        is_required: false,
        max_select: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    priceVariants: [],
  },
] as ProductWithRelations[];

describe('ProductList', () => {
  it('renders products and categories', () => {
    render(<ProductList products={mockProducts} categories={categories} />);

    expect(screen.getByText('โกโก้เย็น')).toBeInTheDocument();
    expect(screen.getByText('ขนมปังปิ้ง')).toBeInTheDocument();
    expect(screen.getAllByText('เครื่องดื่ม').length).toBeGreaterThan(0);
  });

  it('renders image thumbnail when image is available', () => {
    render(<ProductList products={mockProducts} categories={categories} />);

    expect(screen.getByAltText('รูปของ โกโก้เย็น')).toBeInTheDocument();
  });

  it('renders placeholder text when image is missing', () => {
    render(<ProductList products={mockProducts} categories={categories} />);
    expect(screen.getAllByText('ไม่มีรูป').length).toBeGreaterThan(0);
  });

  it('sorts products by created date descending by default', () => {
    const unordered = [
      { ...mockProducts[0], id: 99, name: 'ใหม่กว่า', created_at: '2024-02-01T00:00:00Z' },
      { ...mockProducts[1], id: 100, name: 'เก่ากว่า', created_at: '2023-12-01T00:00:00Z' }
    ];

    render(<ProductList products={unordered} categories={categories} />);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('ใหม่กว่า');
  });

  it('filters by search term', () => {
    render(<ProductList products={mockProducts} categories={categories} />);

    const input = screen.getByPlaceholderText('ค้นหาโดยชื่อหรือรหัสสินค้า');
    fireEvent.change(input, { target: { value: 'โกโก้' } });

    expect(screen.getByText('โกโก้เย็น')).toBeInTheDocument();
    expect(screen.queryByText('ขนมปังปิ้ง')).not.toBeInTheDocument();
  });

  it('filters by category selection', async () => {
    render(<ProductList products={mockProducts} categories={categories} />);

    const categorySelect = screen.getByLabelText('filter-category') as HTMLSelectElement;
    fireEvent.change(categorySelect, { target: { value: '2' } });

    expect(screen.getByText('ขนมปังปิ้ง')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('โกโก้เย็น')).not.toBeInTheDocument());
  });

  it('shows success toast when created flag is present', () => {
    render(
      <ProductList
        products={mockProducts}
        categories={categories}
        searchParams={{ created: 'true' }}
      />
    );

    expect(screen.getByText('สร้างสินค้าสำเร็จ')).toBeInTheDocument();
  });
});
