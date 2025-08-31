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
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ItemsService = class ItemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createItemDto, tenantId) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: createItemDto.category_id,
                tenant_id: tenantId,
                is_active: true,
            },
        });
        if (!category) {
            throw new common_1.BadRequestException('Catégorie non trouvée ou inactive');
        }
        const existingItem = await this.prisma.item.findFirst({
            where: {
                tenant_id: tenantId,
                name: createItemDto.name,
            },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Un item avec ce nom existe déjà');
        }
        return this.prisma.item.create({
            data: {
                ...createItemDto,
                tenant_id: tenantId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
                is_available: true,
                out_of_stock: true,
                sort_order: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findAllByTenant(tenantId, includeUnavailable = false) {
        const whereCondition = { tenant_id: tenantId };
        if (!includeUnavailable) {
            whereCondition.is_available = true;
        }
        return this.prisma.item.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
                is_available: true,
                out_of_stock: true,
                sort_order: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [
                { sort_order: 'asc' },
                { created_at: 'asc' },
            ],
        });
    }
    async findAllByCategory(categoryId, tenantId, includeUnavailable = false) {
        const whereCondition = {
            category_id: categoryId,
            tenant_id: tenantId,
        };
        if (!includeUnavailable) {
            whereCondition.is_available = true;
        }
        return this.prisma.item.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
                is_available: true,
                out_of_stock: true,
                sort_order: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: [
                { sort_order: 'asc' },
                { created_at: 'asc' },
            ],
        });
    }
    async findOne(id, tenantId) {
        const item = await this.prisma.item.findFirst({
            where: {
                id,
                tenant_id: tenantId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
                is_available: true,
                out_of_stock: true,
                sort_order: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item non trouvé');
        }
        return item;
    }
    async update(id, updateItemDto, tenantId) {
        await this.findOne(id, tenantId);
        if (updateItemDto.category_id) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: updateItemDto.category_id,
                    tenant_id: tenantId,
                    is_active: true,
                },
            });
            if (!category) {
                throw new common_1.BadRequestException('Catégorie non trouvée ou inactive');
            }
        }
        if (updateItemDto.name) {
            const existingItem = await this.prisma.item.findFirst({
                where: {
                    tenant_id: tenantId,
                    name: updateItemDto.name,
                    id: { not: id },
                },
            });
            if (existingItem) {
                throw new common_1.ConflictException('Un item avec ce nom existe déjà');
            }
        }
        return this.prisma.item.update({
            where: { id },
            data: updateItemDto,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
                is_available: true,
                out_of_stock: true,
                sort_order: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.item.update({
            where: { id },
            data: { is_available: false },
            select: {
                id: true,
                name: true,
                is_available: true,
            },
        });
    }
    async toggleStock(id, tenantId) {
        const item = await this.findOne(id, tenantId);
        return this.prisma.item.update({
            where: { id },
            data: { out_of_stock: !item.out_of_stock },
            select: {
                id: true,
                name: true,
                out_of_stock: true,
            },
        });
    }
    async reorderItems(categoryId, tenantId, itemOrders) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                tenant_id: tenantId,
            },
        });
        if (!category) {
            throw new common_1.BadRequestException('Catégorie non trouvée');
        }
        const updatePromises = itemOrders.map(({ id, sort_order }) => this.prisma.item.updateMany({
            where: {
                id,
                category_id: categoryId,
                tenant_id: tenantId,
            },
            data: { sort_order },
        }));
        await Promise.all(updatePromises);
        return { message: 'Ordre des items mis à jour avec succès' };
    }
    async getItemStats(tenantId) {
        const [totalItems, availableItems, outOfStockItems, unavailableItems,] = await Promise.all([
            this.prisma.item.count({ where: { tenant_id: tenantId } }),
            this.prisma.item.count({
                where: {
                    tenant_id: tenantId,
                    is_available: true,
                    out_of_stock: false
                }
            }),
            this.prisma.item.count({
                where: {
                    tenant_id: tenantId,
                    is_available: true,
                    out_of_stock: true
                }
            }),
            this.prisma.item.count({
                where: {
                    tenant_id: tenantId,
                    is_available: false
                }
            }),
        ]);
        return {
            totalItems,
            availableItems,
            outOfStockItems,
            unavailableItems,
        };
    }
    async searchItems(tenantId, query) {
        return this.prisma.item.findMany({
            where: {
                tenant_id: tenantId,
                is_available: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
                out_of_stock: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItemsService);
//# sourceMappingURL=items.service.js.map