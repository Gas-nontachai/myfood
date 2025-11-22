import { searchParams } from "./page";

export type Category = {
    id: number;
    name: string;
    parent_id?: number | null;
    description?: string | null;
};

export type CategorysListProps = {
    product_category: Category[];
    searchParams?: searchParams;
};

export type CategorysPageParams = {
    searchParams?: Promise<{
        q?: string;
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    }>;
};
