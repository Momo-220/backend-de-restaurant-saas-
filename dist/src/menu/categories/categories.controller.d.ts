import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, tenant: any): Promise<{
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
    }>;
    findAll(tenant: any, includeInactive?: string): Promise<{
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
    findAllPublic(tenantSlug: string): Promise<{
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
    getStats(tenant: any): Promise<{
        totalCategories: number;
        activeCategories: number;
        inactiveCategories: number;
        totalItems: number;
        availableItems: number;
        outOfStockItems: number;
    }>;
    findOne(id: string, tenant: any): Promise<{
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
    update(id: string, updateCategoryDto: UpdateCategoryDto, tenant: any): Promise<{
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        image_url: string;
        sort_order: number;
    }>;
    remove(id: string, tenant: any): Promise<{
        id: string;
        name: string;
    }>;
    reorder(categoryOrders: {
        id: string;
        sort_order: number;
    }[], tenant: any): Promise<{
        message: string;
    }>;
}
