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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const order_items_service_1 = require("./order-items.service");
const websocket_service_1 = require("../websocket/websocket.service");
const order_types_1 = require("../common/types/order.types");
let OrdersService = class OrdersService {
    constructor(prisma, orderItemsService, webSocketService) {
        this.prisma = prisma;
        this.orderItemsService = orderItemsService;
        this.webSocketService = webSocketService;
    }
    async createPublicOrder(createOrderDto, tenantSlug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                slug: tenantSlug,
                is_active: true,
            },
            select: { id: true },
        });
        if (!tenant) {
            throw new common_1.BadRequestException('Restaurant non trouvé');
        }
        return this.create(createOrderDto, tenant.id);
    }
    async create(createOrderDto, tenantId, userId) {
        if (createOrderDto.table_id) {
            const table = await this.prisma.table.findFirst({
                where: {
                    id: createOrderDto.table_id,
                    tenant_id: tenantId,
                    is_active: true,
                },
            });
            if (!table) {
                throw new common_1.BadRequestException('Table non trouvée ou inactive');
            }
        }
        const { items: validatedItems, totalAmount } = await this.orderItemsService.validateAndCalculateItems(createOrderDto.items, tenantId);
        if (validatedItems.length === 0) {
            throw new common_1.BadRequestException('La commande doit contenir au moins un item');
        }
        const orderNumber = await this.generateOrderNumber(tenantId);
        const order = await this.prisma.order.create({
            data: {
                tenant_id: tenantId,
                user_id: userId || null,
                table_id: createOrderDto.table_id || null,
                order_number: orderNumber,
                customer_name: createOrderDto.customer_name || null,
                customer_phone: createOrderDto.customer_phone || null,
                payment_method: createOrderDto.payment_method,
                total_amount: totalAmount,
                notes: createOrderDto.notes || null,
                status: order_types_1.OrderStatus.PENDING,
            },
            select: {
                id: true,
                order_number: true,
                customer_name: true,
                customer_phone: true,
                status: true,
                payment_method: true,
                total_amount: true,
                notes: true,
                created_at: true,
                table: {
                    select: {
                        id: true,
                        number: true,
                        name: true,
                    },
                },
            },
        });
        await this.orderItemsService.createOrderItems(order.id, validatedItems);
        await this.prisma.event.create({
            data: {
                tenant_id: tenantId,
                user_id: userId || null,
                order_id: order.id,
                event_type: 'ORDER_CREATED',
                description: `Nouvelle commande créée: ${order.order_number}`,
                metadata: {
                    order_number: order.order_number,
                    total_amount: totalAmount,
                    items_count: validatedItems.length,
                    payment_method: createOrderDto.payment_method,
                },
            },
        });
        const completeOrder = await this.findOne(order.id, tenantId);
        this.webSocketService.emitNewOrder(tenantId, completeOrder);
        return completeOrder;
    }
    async findAllByTenant(tenantId, filters) {
        const { page = 1, limit = 20, ...filterConditions } = filters;
        const skip = (page - 1) * limit;
        const whereCondition = { tenant_id: tenantId };
        if (filterConditions.status) {
            whereCondition.status = filterConditions.status;
        }
        if (filterConditions.payment_method) {
            whereCondition.payment_method = filterConditions.payment_method;
        }
        if (filterConditions.table_id) {
            whereCondition.table_id = filterConditions.table_id;
        }
        if (filterConditions.date_from || filterConditions.date_to) {
            whereCondition.created_at = {};
            if (filterConditions.date_from) {
                whereCondition.created_at.gte = new Date(filterConditions.date_from);
            }
            if (filterConditions.date_to) {
                whereCondition.created_at.lte = new Date(filterConditions.date_to);
            }
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    order_number: true,
                    customer_name: true,
                    customer_phone: true,
                    status: true,
                    payment_method: true,
                    total_amount: true,
                    created_at: true,
                    updated_at: true,
                    table: {
                        select: {
                            id: true,
                            number: true,
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                        },
                    },
                    _count: {
                        select: {
                            order_items: true,
                        },
                    },
                },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where: whereCondition }),
        ]);
        return {
            orders: orders.map(order => ({
                ...order,
                items_count: order._count.order_items,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id,
                tenant_id: tenantId,
            },
            select: {
                id: true,
                order_number: true,
                customer_name: true,
                customer_phone: true,
                status: true,
                payment_method: true,
                total_amount: true,
                notes: true,
                created_at: true,
                updated_at: true,
                table: {
                    select: {
                        id: true,
                        number: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Commande non trouvée');
        }
        const orderItems = await this.orderItemsService.getOrderItems(order.id);
        return {
            ...order,
            order_items: orderItems,
        };
    }
    async updateStatus(id, updateStatusDto, tenantId, userId) {
        const order = await this.findOne(id, tenantId);
        this.validateStatusTransition(order.status, updateStatusDto.status);
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                status: updateStatusDto.status,
                updated_at: new Date(),
            },
            select: {
                id: true,
                order_number: true,
                status: true,
                updated_at: true,
            },
        });
        await this.prisma.event.create({
            data: {
                tenant_id: tenantId,
                user_id: userId || null,
                order_id: order.id,
                event_type: 'ORDER_UPDATED',
                description: `Statut commande ${order.order_number}: ${order.status} → ${updateStatusDto.status}`,
                metadata: {
                    order_number: order.order_number,
                    old_status: order.status,
                    new_status: updateStatusDto.status,
                    reason: updateStatusDto.reason,
                },
            },
        });
        this.webSocketService.emitOrderStatusUpdate(tenantId, {
            ...updatedOrder,
            old_status: order.status,
        });
        if (updateStatusDto.status === order_types_1.OrderStatus.READY) {
            this.webSocketService.emitOrderReady(tenantId, updatedOrder);
        }
        return updatedOrder;
    }
    async cancel(id, reason, tenantId, userId) {
        const order = await this.findOne(id, tenantId);
        if (order.status === order_types_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Impossible d\'annuler une commande déjà livrée');
        }
        if (order.status === order_types_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Commande déjà annulée');
        }
        return this.updateStatus(id, {
            status: order_types_1.OrderStatus.CANCELLED,
            reason
        }, tenantId, userId);
    }
    async getOrderStats(tenantId, dateFrom, dateTo) {
        const whereCondition = { tenant_id: tenantId };
        if (dateFrom || dateTo) {
            whereCondition.created_at = {};
            if (dateFrom)
                whereCondition.created_at.gte = dateFrom;
            if (dateTo)
                whereCondition.created_at.lte = dateTo;
        }
        const [totalOrders, ordersByStatus, totalRevenue, averageOrderValue, ordersByPaymentMethod,] = await Promise.all([
            this.prisma.order.count({ where: whereCondition }),
            this.prisma.order.groupBy({
                by: ['status'],
                where: whereCondition,
                _count: { status: true },
            }),
            this.prisma.order.aggregate({
                where: { ...whereCondition, status: order_types_1.OrderStatus.DELIVERED },
                _sum: { total_amount: true },
            }),
            this.prisma.order.aggregate({
                where: whereCondition,
                _avg: { total_amount: true },
            }),
            this.prisma.order.groupBy({
                by: ['payment_method'],
                where: whereCondition,
                _count: { payment_method: true },
                _sum: { total_amount: true },
            }),
        ]);
        const itemStats = await this.orderItemsService.getOrderItemsStats(tenantId, dateFrom, dateTo);
        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.total_amount || 0,
            averageOrderValue: averageOrderValue._avg.total_amount || 0,
            ordersByStatus: ordersByStatus.reduce((acc, item) => {
                acc[item.status] = item._count.status;
                return acc;
            }, {}),
            ordersByPaymentMethod: ordersByPaymentMethod.map(item => ({
                method: item.payment_method,
                count: item._count.payment_method,
                total_amount: item._sum.total_amount || 0,
            })),
            items: itemStats,
        };
    }
    async getActiveOrders(tenantId) {
        const activeStatuses = [order_types_1.OrderStatus.PENDING, order_types_1.OrderStatus.ACCEPTED, order_types_1.OrderStatus.PREPARING, order_types_1.OrderStatus.READY];
        return this.prisma.order.findMany({
            where: {
                tenant_id: tenantId,
                status: { in: activeStatuses },
            },
            select: {
                id: true,
                order_number: true,
                customer_name: true,
                status: true,
                total_amount: true,
                created_at: true,
                table: {
                    select: {
                        number: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        order_items: true,
                    },
                },
            },
            orderBy: { created_at: 'asc' },
        });
    }
    async generateOrderNumber(tenantId) {
        const today = new Date();
        const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
        const lastOrder = await this.prisma.order.findFirst({
            where: {
                tenant_id: tenantId,
                order_number: { startsWith: datePrefix },
            },
            orderBy: { order_number: 'desc' },
        });
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.order_number.slice(-4));
            sequence = lastSequence + 1;
        }
        return `${datePrefix}${sequence.toString().padStart(4, '0')}`;
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [order_types_1.OrderStatus.PENDING]: [order_types_1.OrderStatus.ACCEPTED, order_types_1.OrderStatus.CANCELLED],
            [order_types_1.OrderStatus.ACCEPTED]: [order_types_1.OrderStatus.PREPARING, order_types_1.OrderStatus.CANCELLED],
            [order_types_1.OrderStatus.PREPARING]: [order_types_1.OrderStatus.READY, order_types_1.OrderStatus.CANCELLED],
            [order_types_1.OrderStatus.READY]: [order_types_1.OrderStatus.DELIVERED, order_types_1.OrderStatus.CANCELLED],
            [order_types_1.OrderStatus.DELIVERED]: [],
            [order_types_1.OrderStatus.CANCELLED]: [],
        };
        const allowedTransitions = validTransitions[currentStatus];
        if (!allowedTransitions.includes(newStatus)) {
            throw new common_1.BadRequestException(`Transition invalide: ${currentStatus} → ${newStatus}. ` +
                `Transitions autorisées: ${allowedTransitions.join(', ')}`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        order_items_service_1.OrderItemsService,
        websocket_service_1.WebSocketService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map