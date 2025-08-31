import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order.dto';
export declare class OrderItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    validateAndCalculateItems(items: CreateOrderItemDto[], tenantId: string): Promise<{
        items: any[];
        totalAmount: number;
    }>;
    createOrderItems(orderId: string, validatedItems: any[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getOrderItems(orderId: string): Promise<{
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
    }[]>;
    getOrderItemsStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<{
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
    }>;
}
