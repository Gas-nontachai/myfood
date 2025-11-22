import { searchParams } from "./page";

export type Role = {
    id: number;
    name: string;
    description?: string | null;
};

export type RolesListProps = {
    roles: Role[];
    searchParams?: searchParams;
};

export type RolesPageParams = {
    searchParams?: Promise<{
        q?: string;
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    }>;
};
