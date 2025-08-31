import { Response } from 'express';
import { PdfService } from './pdf.service';
import { FilesService } from './files.service';
export declare class PdfController {
    private readonly pdfService;
    private readonly filesService;
    constructor(pdfService: PdfService, filesService: FilesService);
    generateOrderReceipt(orderId: string, tenant: any): Promise<{
        order_id: string;
        pdf_url: string;
        public_url: string;
        download_url: string;
    }>;
    getPdfStats(tenant: any): Promise<{
        totalReceipts: number;
        recentReceipts: {
            id: string;
            created_at: Date;
            order_number: string;
            total_amount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
    downloadPdf(filename: string, res: Response): Promise<Response<any, Record<string, any>>>;
    viewPdf(filename: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
