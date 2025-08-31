import { PaymentsService } from './payments.service';
export declare class WebhooksController {
    private paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    handleMyNitaWebhook(body: any, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleWaveWebhook(body: any, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleTestWebhook(provider: string, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private mapMyNitaStatus;
    private mapWaveStatus;
}
