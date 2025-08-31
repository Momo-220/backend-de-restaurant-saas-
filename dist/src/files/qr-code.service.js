"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const files_service_1 = require("./files.service");
const QRCode = require("qrcode");
let QrCodeService = class QrCodeService {
    constructor(configService, prisma, filesService) {
        this.configService = configService;
        this.prisma = prisma;
        this.filesService = filesService;
    }
    async generateTableQRCode(tableId, tenantId, options) {
        const table = await this.prisma.table.findFirst({
            where: {
                id: tableId,
                tenant_id: tenantId,
                is_active: true,
            },
            include: {
                tenant: {
                    select: {
                        slug: true,
                        name: true,
                    },
                },
            },
        });
        if (!table) {
            throw new common_1.BadRequestException('Table non trouvée ou inactive');
        }
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const menuUrl = `${frontendUrl}/resto/${table.tenant.slug}/menu?table=${table.id}`;
        const qrOptions = {
            width: options?.size || 300,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        };
        const qrBuffer = await QRCode.toBuffer(menuUrl, qrOptions);
        const filename = this.filesService.generateUniqueFilename(`table_${table.number}_qr.png`, 'qr');
        const relativePath = await this.filesService.saveFile(qrBuffer, filename, 'qr-codes');
        await this.prisma.table.update({
            where: { id: tableId },
            data: { qr_code_url: relativePath },
        });
        return relativePath;
    }
    async generateMenuQRCode(tenantSlug, options) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug: tenantSlug, is_active: true },
            select: { id: true, name: true, slug: true },
        });
        if (!tenant) {
            throw new common_1.BadRequestException('Restaurant non trouvé');
        }
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const menuUrl = `${frontendUrl}/resto/${tenant.slug}/menu`;
        const qrOptions = {
            width: options?.size || 400,
            margin: options?.margin || 3,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        };
        const qrBuffer = await QRCode.toBuffer(menuUrl, qrOptions);
        const filename = this.filesService.generateUniqueFilename(`${tenant.slug}_menu_qr.png`, 'menu');
        const relativePath = await this.filesService.saveFile(qrBuffer, filename, 'qr-codes');
        return relativePath;
    }
    async generateCustomQRCode(data, options) {
        const qrOptions = {
            width: options?.size || 300,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        };
        return await QRCode.toBuffer(data, qrOptions);
    }
    async generateAllTableQRCodes(tenantId) {
        const tables = await this.prisma.table.findMany({
            where: {
                tenant_id: tenantId,
                is_active: true,
            },
            include: {
                tenant: {
                    select: {
                        slug: true,
                        name: true,
                    },
                },
            },
            orderBy: { number: 'asc' },
        });
        const results = [];
        for (const table of tables) {
            try {
                const qrUrl = await this.generateTableQRCode(table.id, tenantId);
                results.push({
                    table: {
                        id: table.id,
                        number: table.number,
                        name: table.name,
                        capacity: table.capacity,
                    },
                    qr_url: qrUrl,
                });
            }
            catch (error) {
                console.error(`Erreur génération QR pour table ${table.number}:`, error);
                results.push({
                    table: {
                        id: table.id,
                        number: table.number,
                        name: table.name,
                        capacity: table.capacity,
                    },
                    qr_url: null,
                    error: error.message,
                });
            }
        }
        return results;
    }
    async regenerateTableQRCode(tableId, tenantId) {
        const table = await this.prisma.table.findFirst({
            where: { id: tableId, tenant_id: tenantId },
            select: { qr_code_url: true },
        });
        if (table?.qr_code_url) {
            await this.filesService.deleteFile(table.qr_code_url);
        }
        return this.generateTableQRCode(tableId, tenantId);
    }
    async getQRCodeStats(tenantId) {
        const [totalTables, tablesWithQR, recentQRCodes,] = await Promise.all([
            this.prisma.table.count({
                where: { tenant_id: tenantId, is_active: true },
            }),
            this.prisma.table.count({
                where: {
                    tenant_id: tenantId,
                    is_active: true,
                    qr_code_url: { not: null },
                },
            }),
            this.prisma.table.findMany({
                where: {
                    tenant_id: tenantId,
                    qr_code_url: { not: null },
                    updated_at: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
                select: {
                    id: true,
                    number: true,
                    name: true,
                    qr_code_url: true,
                    updated_at: true,
                },
                orderBy: { updated_at: 'desc' },
                take: 10,
            }),
        ]);
        return {
            totalTables,
            tablesWithQR,
            tablesWithoutQR: totalTables - tablesWithQR,
            coveragePercentage: totalTables > 0 ? Math.round((tablesWithQR / totalTables) * 100) : 0,
            recentQRCodes,
        };
    }
};
exports.QrCodeService = QrCodeService;
exports.QrCodeService = QrCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        files_service_1.FilesService])
], QrCodeService);
//# sourceMappingURL=qr-code.service.js.map