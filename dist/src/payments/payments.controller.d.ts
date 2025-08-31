import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initiatePayment(orderId: string, initiatePaymentDto: InitiatePaymentDto, tenant: any): Promise<{
        success: boolean;
        message: string;
        data: import("./payments.service").PaymentInitiationResult;
    }>;
    getPayment(paymentId: string, tenant: any): Promise<{
        success: boolean;
        data: {
            order: {
                table: {
                    number: string;
                    id: string;
                    tenant_id: string;
                    is_active: boolean;
                    created_at: Date;
                    updated_at: Date;
                    name: string | null;
                    capacity: number;
                    qr_code_url: string | null;
                };
                order_items: ({
                    item: {
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
                    };
                } & {
                    id: string;
                    created_at: Date;
                    notes: string | null;
                    order_id: string;
                    item_id: string;
                    quantity: number;
                    unit_price: import("@prisma/client/runtime/library").Decimal;
                    total_price: import("@prisma/client/runtime/library").Decimal;
                })[];
            } & {
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
            };
        } & {
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
        };
    }>;
    getPayments(query: any, tenant: any): Promise<{
        success: boolean;
        data: ({
            order: {
                table: {
                    number: string;
                    name: string;
                };
                order_number: string;
                total_amount: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
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
        })[];
        filters: {
            status: any;
            method: any;
            from_date: any;
            to_date: any;
            limit: number;
            offset: number;
        };
    }>;
    getPaymentStats(tenant: any): Promise<{
        success: boolean;
        data: {
            total_payments: number;
            successful_payments: number;
            pending_payments: number;
            failed_payments: number;
            success_rate: number;
            total_revenue: number | import("@prisma/client/runtime/library").Decimal;
            payments_by_method: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "method"[]> & {
                _count: number;
            })[];
        };
    }>;
    getProvidersStatus(): Promise<{
        success: boolean;
        data: {
            mynita: {
                configured: boolean;
                api_url: string;
                merchant_id: string;
            };
            wave: {
                configured: boolean;
                api_url: string;
                merchant_id: string;
            };
        };
    }>;
}
