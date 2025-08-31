import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto, tenantId: string): Promise<{
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
    }>;
    findAllByTenant(tenantId: string, includeInactive?: boolean): Promise<{
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        _count: {
            items: number;
        };
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
        items: {
            id: string;
            name: string;
            description: string;
            image_url: string;
            sort_order: number;
            price: import("@prisma/client/runtime/library").Decimal;
            out_of_stock: boolean;
        }[];
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, tenantId: string): Promise<{
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        name: string;
    }>;
    reorderCategories(tenantId: string, categoryOrders: {
        id: string;
        sort_order: number;
    }[]): Promise<{
        message: string;
    }>;
    getCategoryStats(tenantId: string): Promise<{
        totalCategories: number;
        activeCategories: number;
        inactiveCategories: number;
        totalItems: number;
        availableItems: number;
        outOfStockItems: number;
    }>;
}
