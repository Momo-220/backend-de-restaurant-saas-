import { PrismaService } from '../prisma/prisma.service';
import { OrderItemsService } from './order-items.service';
import { WebSocketService } from '../websocket/websocket.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFiltersDto } from './dto/order-filters.dto';
export declare class OrdersService {
    private prisma;
    private orderItemsService;
    private webSocketService;
    constructor(prisma: PrismaService, orderItemsService: OrderItemsService, webSocketService: WebSocketService);
    createPublicOrder(createOrderDto: CreateOrderDto, tenantSlug: string): Promise<{
        order_items: {
            item: {
                category: {
                    id: string;
                    name: string;
                };
                id: string;
                name: string;
                description: string;
                image_url: string;
            };
            id: string;
            notes: string;
            quantity: number;
            unit_price: import("@prisma/client/runtime/library").Decimal;
            total_price: import("@prisma/client/runtime/library").Decimal;
        }[];
        user: {
            id: string;
            first_name: string;
            last_name: string;
        };
        table: {
            number: string;
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        order_number: string;
        customer_name: string;
        customer_phone: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        payment_method: import(".prisma/client").$Enums.PaymentMethod;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string;
    }>;
    create(createOrderDto: CreateOrderDto, tenantId: string, userId?: string): Promise<{
        order_items: {
            item: {
                category: {
                    id: string;
                    name: string;
                };
                id: string;
                name: string;
                description: string;
                image_url: string;
            };
            id: string;
            notes: string;
            quantity: number;
            unit_price: import("@prisma/client/runtime/library").Decimal;
            total_price: import("@prisma/client/runtime/library").Decimal;
        }[];
        user: {
            id: string;
            first_name: string;
            last_name: string;
        };
        table: {
            number: string;
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        order_number: string;
        customer_name: string;
        customer_phone: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        payment_method: import(".prisma/client").$Enums.PaymentMethod;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string;
    }>;
    findAllByTenant(tenantId: string, filters: OrderFiltersDto): Promise<{
        orders: {
            items_count: number;
            user: {
                id: string;
                first_name: string;
                last_name: string;
            };
            table: {
                number: string;
                id: string;
                name: string;
            };
            id: string;
            created_at: Date;
            updated_at: Date;
            _count: {
                order_items: number;
            };
            order_number: string;
            customer_name: string;
            customer_phone: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            payment_method: import(".prisma/client").$Enums.PaymentMethod;
            total_amount: import("@prisma/client/runtime/library").Decimal;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string, tenantId: string): Promise<{
        order_items: {
            item: {
                category: {
                    id: string;
                    name: string;
                };
                id: string;
                name: string;
                description: string;
                image_url: string;
            };
            id: string;
            notes: string;
            quantity: number;
            unit_price: import("@prisma/client/runtime/library").Decimal;
            total_price: import("@prisma/client/runtime/library").Decimal;
        }[];
        user: {
            id: string;
            first_name: string;
            last_name: string;
        };
        table: {
            number: string;
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        updated_at: Date;
        order_number: string;
        customer_name: string;
        customer_phone: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        payment_method: import(".prisma/client").$Enums.PaymentMethod;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, tenantId: string, userId?: string): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    cancel(id: string, reason: string, tenantId: string, userId?: string): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    getOrderStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<{
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        averageOrderValue: number | import("@prisma/client/runtime/library").Decimal;
        ordersByStatus: Record<string, number>;
        ordersByPaymentMethod: {
            method: import(".prisma/client").$Enums.PaymentMethod;
            count: number;
            total_amount: number | import("@prisma/client/runtime/library").Decimal;
        }[];
        items: {
            totalItemsSold: number;
            totalOrders: number | {
                id: number;
            };
            topItems: {
                total_quantity: number;
                orders_count: number;
                category: {
                    name: string;
                };
                id: string;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
            }[];
        };
    }>;
    getActiveOrders(tenantId: string): Promise<{
        table: {
            number: string;
            name: string;
        };
        id: string;
        created_at: Date;
        _count: {
            order_items: number;
        };
        order_number: string;
        customer_name: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total_amount: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    private generateOrderNumber;
    private validateStatusTransition;
}
