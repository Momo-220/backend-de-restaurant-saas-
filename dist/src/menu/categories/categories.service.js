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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto, tenantId) {
        const existingCategory = await this.prisma.category.findFirst({
            where: {
                tenant_id: tenantId,
                name: createCategoryDto.name,
            },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Une catégorie avec ce nom existe déjà');
        }
        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                tenant_id: tenantId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                sort_order: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async findAllByTenant(tenantId, includeInactive = false) {
        const whereCondition = { tenant_id: tenantId };
        if (!includeInactive) {
            whereCondition.is_active = true;
        }
        return this.prisma.category.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                sort_order: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                _count: {
                    select: {
                        items: {
                            where: { is_available: true },
                        },
                    },
                },
            },
            orderBy: [
                { sort_order: 'asc' },
                { created_at: 'asc' },
            ],
        });
    }
    async findOne(id, tenantId) {
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                tenant_id: tenantId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                sort_order: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                items: {
                    where: { is_available: true },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        image_url: true,
                        out_of_stock: true,
                        sort_order: true,
                    },
                    orderBy: [
                        { sort_order: 'asc' },
                        { created_at: 'asc' },
                    ],
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        return category;
    }
    async update(id, updateCategoryDto, tenantId) {
        await this.findOne(id, tenantId);
        if (updateCategoryDto.name) {
            const existingCategory = await this.prisma.category.findFirst({
                where: {
                    tenant_id: tenantId,
                    name: updateCategoryDto.name,
                    id: { not: id },
                },
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Une catégorie avec ce nom existe déjà');
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                sort_order: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        const itemsCount = await this.prisma.item.count({
            where: {
                category_id: id,
                is_available: true,
            },
        });
        if (itemsCount > 0) {
            return this.prisma.category.update({
                where: { id },
                data: { is_active: false },
                select: {
                    id: true,
                    name: true,
                    is_active: true,
                },
            });
        }
        else {
            return this.prisma.category.delete({
                where: { id },
                select: {
                    id: true,
                    name: true,
                },
            });
        }
    }
    async reorderCategories(tenantId, categoryOrders) {
        const updatePromises = categoryOrders.map(({ id, sort_order }) => this.prisma.category.updateMany({
            where: {
                id,
                tenant_id: tenantId,
            },
            data: { sort_order },
        }));
        await Promise.all(updatePromises);
        return { message: 'Ordre des catégories mis à jour avec succès' };
    }
    async getCategoryStats(tenantId) {
        const [totalCategories, activeCategories, totalItems, availableItems,] = await Promise.all([
            this.prisma.category.count({ where: { tenant_id: tenantId } }),
            this.prisma.category.count({ where: { tenant_id: tenantId, is_active: true } }),
            this.prisma.item.count({ where: { tenant_id: tenantId } }),
            this.prisma.item.count({
                where: {
                    tenant_id: tenantId,
                    is_available: true,
                    out_of_stock: false
                }
            }),
        ]);
        return {
            totalCategories,
            activeCategories,
            inactiveCategories: totalCategories - activeCategories,
            totalItems,
            availableItems,
            outOfStockItems: totalItems - availableItems,
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map