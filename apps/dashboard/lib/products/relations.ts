import type { Database } from '@myfood/shared-types';
import type {
  Category,
  ProductOptionGroup,
  ProductPriceVariant,
  ProductWithRelations,
} from '../../types';
import { toNumberOrNull } from '../utils/number';

type ProductRow = Database['public']['Tables']['product']['Row'];
type ProductCategoryMapRow = Database['public']['Tables']['product_category_map']['Row'];
type ProductOptionGroupMapRow =
  Database['public']['Tables']['product_option_group_map']['Row'];

export type BuildProductsWithRelationsInput = {
  products: ProductRow[] | null;
  categories: Category[] | null;
  categoryMap: ProductCategoryMapRow[] | null;
  optionGroups: ProductOptionGroup[] | null;
  optionGroupMap: ProductOptionGroupMapRow[] | null;
  priceVariants: ProductPriceVariant[] | null;
};

export type BuildProductsWithRelationsResult = {
  products: ProductWithRelations[];
  categoriesByProductId: Map<number, Category[]>;
};

function buildMapById<T extends { id: number | string }>(arr: T[] | null | undefined) {
  return new Map(
    (arr ?? [])
      .map((item) => {
        const id = toNumberOrNull(item.id);
        return id !== null ? ([id, item] as const) : null;
      })
      .filter(Boolean) as Array<[number, T]>
  );
}

function collectParentCategories(
  category: Category,
  categoryById: Map<number, Category>
) {
  const parents: Category[] = [];
  let current = category;

  while (current.parent_id) {
    const parentId = toNumberOrNull(current.parent_id);
    if (!parentId) break;

    const parent = categoryById.get(parentId);
    if (!parent) break;

    parents.push(parent);
    current = parent;
  }

  return parents;
}

export function buildProductsWithRelations(
  input: BuildProductsWithRelationsInput
): BuildProductsWithRelationsResult {
  const {
    products,
    categories,
    categoryMap,
    optionGroupMap,
    optionGroups,
    priceVariants,
  } = input;

  const categoryById = buildMapById(categories);
  const optionGroupById = buildMapById(optionGroups);

  const categoriesByProductId = new Map<number, Category[]>();

  (categoryMap ?? []).forEach(({ product_id, category_id }) => {
    const pid = toNumberOrNull(product_id);
    const cid = toNumberOrNull(category_id);
    if (!pid || !cid) return;

    const category = categoryById.get(cid);
    if (!category) return;

    if (!categoriesByProductId.has(pid)) {
      categoriesByProductId.set(pid, []);
    }

    const list = categoriesByProductId.get(pid)!;
    const ensureUnique = (cat: Category) => {
      if (!list.some((existing) => existing.id === cat.id)) {
        list.push(cat);
      }
    };

    ensureUnique(category);

    const parents = collectParentCategories(category, categoryById);
    parents.forEach(ensureUnique);
  });

  const optionGroupsByProductId = new Map<number, ProductOptionGroup[]>();

  (optionGroupMap ?? []).forEach(({ product_id, group_id }) => {
    const pid = toNumberOrNull(product_id);
    const gid = toNumberOrNull(group_id);
    if (!pid || !gid) return;

    const group = optionGroupById.get(gid);
    if (!group) return;

    if (!optionGroupsByProductId.has(pid)) {
      optionGroupsByProductId.set(pid, []);
    }

    optionGroupsByProductId.get(pid)!.push(group);
  });

  const variantsByProductId = new Map<number, ProductPriceVariant[]>();

  (priceVariants ?? []).forEach((variant) => {
    const pid = toNumberOrNull(variant.product_id);
    if (!pid) return;

    if (!variantsByProductId.has(pid)) {
      variantsByProductId.set(pid, []);
    }

    variantsByProductId.get(pid)!.push(variant);
  });

  const productsWithRelations: ProductWithRelations[] = (products ?? []).map((product) => {
    const pid = toNumberOrNull(product.id);
    return {
      ...product,
      categories: pid ? categoriesByProductId.get(pid) ?? [] : [],
      optionGroups: pid ? optionGroupsByProductId.get(pid) ?? [] : [],
      priceVariants: pid ? variantsByProductId.get(pid) ?? [] : [],
    };
  });

  return {
    products: productsWithRelations,
    categoriesByProductId,
  };
}
