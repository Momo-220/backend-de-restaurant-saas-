import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    create(createItemDto: CreateItemDto, tenant: any): Promise<{
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
    findAll(tenant: any, includeUnavailable?: string, categoryId?: string): Promise<{
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
    search(tenant: any, query: string): any[] | Promise<{
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
    getStats(tenant: any): Promise<{
        totalItems: number;
        availableItems: number;
        outOfStockItems: number;
        unavailableItems: number;
    }>;
    findOne(id: string, tenant: any): Promise<{
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
    update(id: string, updateItemDto: UpdateItemDto, tenant: any): Promise<{
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
    toggleStock(id: string, tenant: any): Promise<{
        id: string;
        name: string;
        out_of_stock: boolean;
    }>;
    remove(id: string, tenant: any): Promise<{
        id: string;
        name: string;
        is_available: boolean;
    }>;
    reorder(categoryId: string, itemOrders: {
        id: string;
        sort_order: number;
    }[], tenant: any): Promise<{
        message: string;
    }>;
}
