import { PaymentMethod } from '../../common/types/order.types';
export declare class InitiatePaymentDto {
    order_id: string;
    payment_method: PaymentMethod;
    success_url?: string;
    cancel_url?: string;
    customer_phone?: string;
    customer_email?: string;
}
