import { ConfigService } from '@nestjs/config';
export interface WavePaymentRequest {
    order_id: string;
    amount: number;
    currency: string;
    description: string;
    customer_phone?: string;
    customer_email?: string;
    success_url: string;
    cancel_url: string;
    webhook_url: string;
}
export interface WavePaymentResponse {
    success: boolean;
    transaction_id: string;
    payment_url: string;
    message?: string;
}
export declare class WaveService {
    private configService;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiKey;
    private readonly secretKey;
    private readonly merchantId;
    constructor(configService: ConfigService);
    initiatePayment(paymentRequest: WavePaymentRequest): Promise<WavePaymentResponse>;
    verifyWebhookSignature(payload: any, receivedSignature: string): boolean;
    checkPaymentStatus(transactionId: string): Promise<any>;
    private generateSignature;
    private isConfigured;
    getConfigStatus(): {
        configured: boolean;
        api_url: string;
        merchant_id: string;
    };
}
