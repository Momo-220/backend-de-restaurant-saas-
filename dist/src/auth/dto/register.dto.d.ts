import { UserRole } from '../../common/types/user.types';
export declare class RegisterDto {
    tenant_id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: UserRole;
}
