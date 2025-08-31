import { Response } from 'express';
import { QrCodeService } from './qr-code.service';
import { FilesService } from './files.service';
export declare class QrCodeController {
    private readonly qrCodeService;
    private readonly filesService;
    constructor(qrCodeService: QrCodeService, filesService: FilesService);
    generateTableQRCode(tableId: string, tenant: any, size?: string, margin?: string, darkColor?: string, lightColor?: string): Promise<{
        table_id: string;
        qr_code_url: string;
        public_url: string;
    }>;
    generateMenuQRCode(tenant: any, size?: string, margin?: string, darkColor?: string, lightColor?: string): Promise<{
        tenant_slug: any;
        qr_code_url: string;
        public_url: string;
    }>;
    generatePublicMenuQRCode(tenantSlug: string, size?: string, margin?: string): Promise<{
        tenant_slug: string;
        qr_code_url: string;
        public_url: string;
    }>;
    generateAllTableQRCodes(tenant: any): Promise<{
        tenant_id: any;
        total_tables: number;
        results: {
            public_url: string;
            table: any;
            qr_url: string;
        }[];
    }>;
    regenerateTableQRCode(tableId: string, tenant: any): Promise<{
        table_id: string;
        qr_code_url: string;
        public_url: string;
    }>;
    getQRCodeStats(tenant: any): Promise<{
        totalTables: number;
        tablesWithQR: number;
        tablesWithoutQR: number;
        coveragePercentage: number;
        recentQRCodes: {
            number: string;
            id: string;
            updated_at: Date;
            name: string;
            qr_code_url: string;
        }[];
    }>;
    downloadQRCode(filename: string, res: Response): Promise<Response<any, Record<string, any>>>;
    viewQRCode(filename: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
