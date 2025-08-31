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
exports.OrderItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrderItemsService = class OrderItemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateAndCalculateItems(items, tenantId) {
        const validatedItems = [];
        let totalAmount = 0;
        for (const orderItem of items) {
            const item = await this.prisma.item.findFirst({
                where: {
                    id: orderItem.item_id,
                    tenant_id: tenantId,
                    is_available: true,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    out_of_stock: true,
                    image_url: true,
                },
            });
            if (!item) {
                throw new common_1.BadRequestException(`Item ${orderItem.item_id} non trouvé ou indisponible`);
            }
            if (item.out_of_stock) {
                throw new common_1.BadRequestException(`Item "${item.name}" est en rupture de stock`);
            }
            const unitPrice = parseFloat(item.price.toString());
            const totalPrice = unitPrice * orderItem.quantity;
            totalAmount += totalPrice;
            validatedItems.push({
                item_id: item.id,
                quantity: orderItem.quantity,
                unit_price: unitPrice,
                total_price: totalPrice,
                notes: orderItem.notes || null,
                item: {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image_url: item.image_url,
                },
            });
        }
        return {
            items: validatedItems,
            totalAmount,
        };
    }
    async createOrderItems(orderId, validatedItems) {
        const orderItems = validatedItems.map(item => ({
            order_id: orderId,
            item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            notes: item.notes,
        }));
        return this.prisma.orderItem.createMany({
            data: orderItems,
        });
    }
    async getOrderItems(orderId) {
        return this.prisma.orderItem.findMany({
            where: { order_id: orderId },
            select: {
                id: true,
                quantity: true,
                unit_price: true,
                total_price: true,
                notes: true,
                item: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        image_url: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'asc' },
        });
    }
    async getOrderItemsStats(tenantId, dateFrom, dateTo) {
        const whereCondition = {
            order: { tenant_id: tenantId },
        };
        if (dateFrom || dateTo) {
            whereCondition.created_at = {};
            if (dateFrom)
                whereCondition.created_at.gte = dateFrom;
            if (dateTo)
                whereCondition.created_at.lte = dateTo;
        }
        const [totalItems, topItems,] = await Promise.all([
            this.prisma.orderItem.aggregate({
                where: whereCondition,
                _sum: { quantity: true },
                _count: { id: true },
            }),
            this.prisma.orderItem.groupBy({
                by: ['item_id'],
                where: whereCondition,
                _sum: { quantity: true },
                _count: { id: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 10,
            }),
        ]);
        const topItemsWithDetails = await Promise.all(topItems.map(async (topItem) => {
            const item = await this.prisma.item.findUnique({
                where: { id: topItem.item_id },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    category: {
                        select: { name: true },
                    },
                },
            });
            return {
                ...item,
                total_quantity: topItem._sum.quantity,
                orders_count: topItem._count.id,
            };
        }));
        return {
            totalItemsSold: totalItems._sum.quantity || 0,
            totalOrders: totalItems._count || 0,
            topItems: topItemsWithDetails,
        };
    }
};
exports.OrderItemsService = OrderItemsService;
exports.OrderItemsService = OrderItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderItemsService);
//# sourceMappingURL=order-items.service.js.map