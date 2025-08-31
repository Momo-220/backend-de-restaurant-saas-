import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { WebSocketService } from '../websocket/websocket.service';
import { MyNitaService } from './providers/mynita.service';
import { WaveService } from './providers/wave.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { PaymentMethod } from '../common/types/order.types';
export interface PaymentInitiationResult {
    success: boolean;
    payment_url: string;
    transaction_id: string;
    order_id: string;
    payment_method: PaymentMethod;
    expires_at: Date;
}
export declare class PaymentsService {
    private prisma;
    private ordersService;
    private websocketService;
    private mynitaService;
    private waveService;
    private configService;
    private readonly logger;
    private readonly frontendUrl;
    constructor(prisma: PrismaService, ordersService: OrdersService, websocketService: WebSocketService, mynitaService: MyNitaService, waveService: WaveService, configService: ConfigService);
    initiatePayment(orderId: string, paymentDto: InitiatePaymentDto, tenantId: string): Promise<PaymentInitiationResult>;
    handlePaymentCallback(provider: string, callbackData: PaymentCallbackDto, signature?: string): Promise<void>;
    private validateOrderPayment;
    getPayment(paymentId: string, tenantId: string): Promise<{
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
    }>;
    getPayments(tenantId: string, filters?: any): Promise<({
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
    })[]>;
    getPaymentStats(tenantId: string): Promise<{
        total_payments: number;
        successful_payments: number;
        pending_payments: number;
        failed_payments: number;
        success_rate: number;
        total_revenue: number | import("@prisma/client/runtime/library").Decimal;
        payments_by_method: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "method"[]> & {
            _count: number;
        })[];
    }>;
    private mapProviderStatusToPaymentStatus;
    getProvidersStatus(): {
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
}
