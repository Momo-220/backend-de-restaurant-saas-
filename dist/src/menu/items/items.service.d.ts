import { PrismaService } from '../../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createItemDto: CreateItemDto, tenantId: string): Promise<{
        category: {
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
        price: import("@prisma/client/runtime/library").Decimal;
        is_available: boolean;
        out_of_stock: boolean;
    }>;
    findAllByTenant(tenantId: string, includeUnavailable?: boolean): Promise<{
        category: {
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
        price: import("@prisma/client/runtime/library").Decimal;
        is_available: boolean;
        out_of_stock: boolean;
    }[]>;
    findAllByCategory(categoryId: string, tenantId: string, includeUnavailable?: boolean): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
        price: import("@prisma/client/runtime/library").Decimal;
        is_available: boolean;
        out_of_stock: boolean;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        category: {
            id: string;
            name: string;
            description: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
        price: import("@prisma/client/runtime/library").Decimal;
        is_available: boolean;
        out_of_stock: boolean;
    }>;
    update(id: string, updateItemDto: UpdateItemDto, tenantId: string): Promise<{
        category: {
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
        price: import("@prisma/client/runtime/library").Decimal;
        is_available: boolean;
        out_of_stock: boolean;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        name: string;
        is_available: boolean;
    }>;
    toggleStock(id: string, tenantId: string): Promise<{
        id: string;
        name: string;
        out_of_stock: boolean;
    }>;
    reorderItems(categoryId: string, tenantId: string, itemOrders: {
        id: string;
        sort_order: number;
    }[]): Promise<{
        message: string;
    }>;
    getItemStats(tenantId: string): Promise<{
        totalItems: number;
        availableItems: number;
        outOfStockItems: number;
        unavailableItems: number;
    }>;
    searchItems(tenantId: string, query: string): Promise<{
        category: {
            id: string;
            name: string;
        };
        id: string;
        name: string;
        description: string;
        image_url: string;
        price: import("@prisma/client/runtime/library").Decimal;
        out_of_stock: boolean;
    }[]>;
}
