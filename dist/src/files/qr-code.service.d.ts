import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from './files.service';
export interface QRCodeOptions {
    size?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}
export declare class QrCodeService {
    private configService;
    private prisma;
    private filesService;
    constructor(configService: ConfigService, prisma: PrismaService, filesService: FilesService);
    generateTableQRCode(tableId: string, tenantId: string, options?: QRCodeOptions): Promise<string>;
    generateMenuQRCode(tenantSlug: string, options?: QRCodeOptions): Promise<string>;
    generateCustomQRCode(data: string, options?: QRCodeOptions): Promise<Buffer>;
    generateAllTableQRCodes(tenantId: string): Promise<{
        table: any;
        qr_url: string;
    }[]>;
    regenerateTableQRCode(tableId: string, tenantId: string): Promise<string>;
    getQRCodeStats(tenantId: string): Promise<{
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
}
