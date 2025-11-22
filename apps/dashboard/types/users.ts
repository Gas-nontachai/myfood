import { Profile } from './profile';
import type { Role } from './roles';
import { searchParams } from "./page";

export type UsersListProps = {
    profiles: Profile[];
    roles: Role[];
    searchParams?: searchParams;
};
export type UsersPageParams = {
    searchParams?: Promise<{
        q?: string;
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    }>;
};
