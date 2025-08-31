import { UserRole } from '../../common/types/user.types';
export declare class UpdateUserDto {
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: UserRole;
    is_active?: boolean;
}
