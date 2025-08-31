import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories/categories.service';
import { ItemsService } from './items/items.service';
export declare class MenuService {
    private prisma;
    private categoriesService;
    private itemsService;
    constructor(prisma: PrismaService, categoriesService: CategoriesService, itemsService: ItemsService);
    getFullMenu(tenantId: string, includeUnavailable?: boolean): Promise<{
        items: {
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
        }[];
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
    getPublicMenu(tenantSlug: string): Promise<{
        restaurant: {
            id: string;
            email: string;
            name: string;
            slug: string;
            phone: string;
            address: string;
            logo_url: string;
        };
        menu: {
            items: {
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
            }[];
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
        }[];
    }>;
    getMenuStats(tenantId: string): Promise<{
        categories: {
            totalCategories: number;
            activeCategories: number;
            inactiveCategories: number;
            totalItems: number;
            availableItems: number;
            outOfStockItems: number;
        };
        items: {
            totalItems: number;
            availableItems: number;
            outOfStockItems: number;
            unavailableItems: number;
        };
        summary: {
            totalCategories: number;
            totalItems: number;
            outOfStockItems: number;
            completionRate: number;
        };
    }>;
    searchInMenu(tenantId: string, query: string): Promise<{
        categories: {
            id: string;
            name: string;
            description: string;
            image_url: string;
        }[];
        items: {
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
        }[];
    }>;
    exportMenu(tenantId: string): Promise<{
        exportDate: string;
        tenantId: string;
        menu: {
            items: {
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
            }[];
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
        }[];
        stats: {
            categories: {
                totalCategories: number;
                activeCategories: number;
                inactiveCategories: number;
                totalItems: number;
                availableItems: number;
                outOfStockItems: number;
            };
            items: {
                totalItems: number;
                availableItems: number;
                outOfStockItems: number;
                unavailableItems: number;
            };
            summary: {
                totalCategories: number;
                totalItems: number;
                outOfStockItems: number;
                completionRate: number;
            };
        };
    }>;
}
