import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    forTenant(tenantId: string): {
        user: import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            tenant_id: string;
            email: string;
            password: string;
            first_name: string;
            last_name: string;
            role: import(".prisma/client").$Enums.UserRole;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        }[]>;
        category: import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            tenant_id: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            name: string;
            description: string | null;
            image_url: string | null;
            sort_order: number;
        }[]>;
        item: import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            tenant_id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
            description: string | null;
            image_url: string | null;
            sort_order: number;
            category_id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            is_available: boolean;
            out_of_stock: boolean;
        }[]>;
        table: import(".prisma/client").Prisma.PrismaPromise<{
            number: string;
            id: string;
            tenant_id: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            name: string | null;
            capacity: number;
            qr_code_url: string | null;
        }[]>;
        order: import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            tenant_id: string;
            created_at: Date;
            updated_at: Date;
            table_id: string | null;
            user_id: string | null;
            order_number: string;
            customer_name: string | null;
            customer_phone: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            payment_method: import(".prisma/client").$Enums.PaymentMethod;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
        }[]>;
        payment: import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            tenant_id: string;
            created_at: Date;
            updated_at: Date;
            status: string;
            order_id: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            transaction_id: string | null;
            provider_reference: string | null;
            provider_data: import("@prisma/client/runtime/library").JsonValue | null;
            expires_at: Date | null;
        }[]>;
        event: import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            tenant_id: string;
            created_at: Date;
            description: string;
            user_id: string | null;
            order_id: string | null;
            event_type: import(".prisma/client").$Enums.EventType;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[]>;
    };
}
