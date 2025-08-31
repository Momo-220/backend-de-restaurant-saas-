export declare enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare class PaymentCallbackDto {
    transaction_id: string;
    order_id: string;
    status: PaymentStatus;
    amount?: number;
    currency?: string;
    payment_method?: string;
    provider_reference?: string;
    signature?: string;
    message?: string;
}
