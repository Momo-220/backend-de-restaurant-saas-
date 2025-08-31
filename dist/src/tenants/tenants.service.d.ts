import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTenantDto: CreateTenantDto): Promise<{
        id: string;
        email: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        phone: string;
        address: string;
        logo_url: string;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        phone: string;
        address: string;
        logo_url: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        phone: string;
        address: string;
        logo_url: string;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        email: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        phone: string;
        address: string;
        logo_url: string;
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<{
        id: string;
        email: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        phone: string;
        address: string;
        logo_url: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        is_active: boolean;
        name: string;
        slug: string;
    }>;
    getTenantStats(tenantId: string): Promise<{
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalItems: number;
        totalTables: number;
        activeOrders: number;
    }>;
}
