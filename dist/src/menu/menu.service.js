"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const categories_service_1 = require("./categories/categories.service");
const items_service_1 = require("./items/items.service");
let MenuService = class MenuService {
    constructor(prisma, categoriesService, itemsService) {
        this.prisma = prisma;
        this.categoriesService = categoriesService;
        this.itemsService = itemsService;
    }
    async getFullMenu(tenantId, includeUnavailable = false) {
        const categories = await this.categoriesService.findAllByTenant(tenantId, includeUnavailable);
        const categoriesWithItems = await Promise.all(categories.map(async (category) => {
            const items = await this.itemsService.findAllByCategory(category.id, tenantId, includeUnavailable);
            return {
                ...category,
                items,
            };
        }));
        return categoriesWithItems;
    }
    async getPublicMenu(tenantSlug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                slug: tenantSlug,
                is_active: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                phone: true,
                address: true,
                logo_url: true,
            },
        });
        if (!tenant) {
            throw new Error('Restaurant non trouvé');
        }
        const menu = await this.getFullMenu(tenant.id, false);
        return {
            restaurant: tenant,
            menu: menu.filter(category => category.items.length > 0),
        };
    }
    async getMenuStats(tenantId) {
        const [categoryStats, itemStats] = await Promise.all([
            this.categoriesService.getCategoryStats(tenantId),
            this.itemsService.getItemStats(tenantId),
        ]);
        return {
            categories: categoryStats,
            items: itemStats,
            summary: {
                totalCategories: categoryStats.activeCategories,
                totalItems: itemStats.availableItems,
                outOfStockItems: itemStats.outOfStockItems,
                completionRate: categoryStats.totalCategories > 0
                    ? Math.round((itemStats.availableItems / categoryStats.totalCategories) * 100) / 100
                    : 0,
            },
        };
    }
    async searchInMenu(tenantId, query) {
        if (!query || query.trim().length < 2) {
            return {
                categories: [],
                items: [],
            };
        }
        const [categories, items] = await Promise.all([
            this.prisma.category.findMany({
                where: {
                    tenant_id: tenantId,
                    is_active: true,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image_url: true,
                },
            }),
            this.itemsService.searchItems(tenantId, query),
        ]);
        return {
            categories,
            items,
        };
    }
    async exportMenu(tenantId) {
        const fullMenu = await this.getFullMenu(tenantId, true);
        return {
            exportDate: new Date().toISOString(),
            tenantId,
            menu: fullMenu,
            stats: await this.getMenuStats(tenantId),
        };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        categories_service_1.CategoriesService,
        items_service_1.ItemsService])
], MenuService);
//# sourceMappingURL=menu.service.js.map