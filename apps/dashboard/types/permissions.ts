import { searchParams } from "./page";

export type Permission = {
    id: number;
    code: string;
    description: string | null;
};

export type PermissionsListProps = {
    permissions: Permission[];
    searchParams?: searchParams;
};
