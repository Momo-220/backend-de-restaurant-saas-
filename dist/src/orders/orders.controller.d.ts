import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFiltersDto } from './dto/order-filters.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createPublicOrder(tenantSlug: string, createOrderDto: CreateOrderDto): Promise<{
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
    create(createOrderDto: CreateOrderDto, tenant: any, user: any): Promise<{
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
    findAll(tenant: any, filters: OrderFiltersDto): Promise<{
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
    getActiveOrders(tenant: any): Promise<{
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
    getStats(tenant: any, dateFrom?: string, dateTo?: string): Promise<{
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
    findOne(id: string, tenant: any): Promise<{
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
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, tenant: any, user: any): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    acceptOrder(id: string, tenant: any, user: any): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    startPreparing(id: string, tenant: any, user: any): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    markReady(id: string, tenant: any, user: any): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    markDelivered(id: string, tenant: any, user: any): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    cancelOrder(id: string, reason: string, tenant: any, user: any): Promise<{
        id: string;
        updated_at: Date;
        order_number: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
}
