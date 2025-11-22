import type { Database } from '@myfood/shared-types';
import type { Category } from './category';
import type { searchParams } from './page';

type ProductTable = Database['public']['Tables']['product'];
type PriceVariantTable = Database['public']['Tables']['product_price_variant'];
type OptionGroupTable = Database['public']['Tables']['product_option_group'];

export type Product = ProductTable['Row'];
export type ProductPriceVariant = PriceVariantTable['Row'];
export type ProductOptionGroup = OptionGroupTable['Row'];

export type ProductWithRelations = Product & {
  categories: Category[];
  optionGroups: ProductOptionGroup[];
  priceVariants: ProductPriceVariant[];
};

export type ProductListProps = {
  products: ProductWithRelations[];
  categories: Category[];
  searchParams?: searchParams;
};

export type ProductPageParams = {
  searchParams?: Promise<searchParams>;
};

export type ProductFormState = {
  error?: string;
};
