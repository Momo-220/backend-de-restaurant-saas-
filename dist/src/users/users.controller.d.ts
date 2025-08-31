import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, tenant: any, user: any): Promise<{
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
    findAll(tenant: any): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }[]>;
    getStats(tenant: any): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        usersByRole: Record<string, number>;
    }>;
    findOne(id: string, tenant: any): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto, tenant: any): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    remove(id: string, tenant: any): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        is_active: boolean;
    }>;
    changePassword(changePasswordDto: ChangePasswordDto, user: any, tenant: any): Promise<{
        message: string;
    }>;
}
