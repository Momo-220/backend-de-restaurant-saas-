import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from './files.service';
export interface ReceiptData {
    order: {
        id: string;
        order_number: string;
        customer_name?: string;
        customer_phone?: string;
        total_amount: number;
        payment_method: string;
        status: string;
        created_at: Date;
        notes?: string;
        table?: {
            number: string;
            name?: string;
        };
    };
    restaurant: {
        name: string;
        email?: string;
        phone?: string;
        address?: string;
        logo_url?: string;
    };
    items: Array<{
        name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
        notes?: string;
    }>;
}
export declare class PdfService {
    private configService;
    private prisma;
    private filesService;
    constructor(configService: ConfigService, prisma: PrismaService, filesService: FilesService);
    generateOrderReceipt(orderId: string, tenantId: string): Promise<string>;
    private getOrderReceiptData;
    private generateReceiptHTML;
    private htmlToPdf;
    private getPaymentMethodLabel;
    private getStatusLabel;
    generateCustomPdf(htmlContent: string, filename: string): Promise<string>;
    getPdfStats(tenantId: string): Promise<{
        totalReceipts: number;
        recentReceipts: {
            id: string;
            created_at: Date;
            order_number: string;
            total_amount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
}
