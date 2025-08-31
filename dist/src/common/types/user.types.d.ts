export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    STAFF = "STAFF"
}
export interface UserPayload {
    id: string;
    email: string;
    tenant_id: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    is_active: boolean;
}
