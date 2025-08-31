import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../common/types/user.types';
export interface CreateUserDto {
    tenant_id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: UserRole;
}
export interface UpdateUserDto {
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: UserRole;
    is_active?: boolean;
}
export interface ChangePasswordDto {
    current_password: string;
    new_password: string;
}
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, creatorTenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
        id: string;
        tenant_id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    findAllByTenant(tenantId: string): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        is_active: boolean;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto, tenantId: string): Promise<{
        message: string;
    }>;
    getUserStats(tenantId: string): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        usersByRole: Record<string, number>;
    }>;
}
