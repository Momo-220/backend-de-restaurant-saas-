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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeController = void 0;
const common_1 = require("@nestjs/common");
const qr_code_service_1 = require("./qr-code.service");
const files_service_1 = require("./files.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const user_types_1 = require("../common/types/user.types");
let QrCodeController = class QrCodeController {
    constructor(qrCodeService, filesService) {
        this.qrCodeService = qrCodeService;
        this.filesService = filesService;
    }
    async generateTableQRCode(tableId, tenant, size, margin, darkColor, lightColor) {
        const options = {};
        if (size)
            options.size = parseInt(size);
        if (margin)
            options.margin = parseInt(margin);
        if (darkColor || lightColor) {
            options.color = {};
            if (darkColor)
                options.color.dark = darkColor;
            if (lightColor)
                options.color.light = lightColor;
        }
        const qrUrl = await this.qrCodeService.generateTableQRCode(tableId, tenant.id, options);
        return {
            table_id: tableId,
            qr_code_url: qrUrl,
            public_url: this.filesService.getPublicUrl(qrUrl),
        };
    }
    async generateMenuQRCode(tenant, size, margin, darkColor, lightColor) {
        const options = {};
        if (size)
            options.size = parseInt(size);
        if (margin)
            options.margin = parseInt(margin);
        if (darkColor || lightColor) {
            options.color = {};
            if (darkColor)
                options.color.dark = darkColor;
            if (lightColor)
                options.color.light = lightColor;
        }
        const qrUrl = await this.qrCodeService.generateMenuQRCode(tenant.slug, options);
        return {
            tenant_slug: tenant.slug,
            qr_code_url: qrUrl,
            public_url: this.filesService.getPublicUrl(qrUrl),
        };
    }
    async generatePublicMenuQRCode(tenantSlug, size, margin) {
        const options = {};
        if (size)
            options.size = parseInt(size);
        if (margin)
            options.margin = parseInt(margin);
        const qrUrl = await this.qrCodeService.generateMenuQRCode(tenantSlug, options);
        return {
            tenant_slug: tenantSlug,
            qr_code_url: qrUrl,
            public_url: this.filesService.getPublicUrl(qrUrl),
        };
    }
    async generateAllTableQRCodes(tenant) {
        const results = await this.qrCodeService.generateAllTableQRCodes(tenant.id);
        return {
            tenant_id: tenant.id,
            total_tables: results.length,
            results: results.map(result => ({
                ...result,
                public_url: result.qr_url ? this.filesService.getPublicUrl(result.qr_url) : null,
            })),
        };
    }
    async regenerateTableQRCode(tableId, tenant) {
        const qrUrl = await this.qrCodeService.regenerateTableQRCode(tableId, tenant.id);
        return {
            table_id: tableId,
            qr_code_url: qrUrl,
            public_url: this.filesService.getPublicUrl(qrUrl),
        };
    }
    async getQRCodeStats(tenant) {
        return this.qrCodeService.getQRCodeStats(tenant.id);
    }
    async downloadQRCode(filename, res) {
        if (!filename.match(/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg)$/)) {
            throw new common_1.BadRequestException('Nom de fichier invalide');
        }
        const relativePath = `/public/qr-codes/${filename}`;
        const buffer = await this.filesService.getFileBuffer(relativePath);
        if (!buffer) {
            return res.status(404).json({ message: 'QR Code non trouvé' });
        }
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'public, max-age=86400',
        });
        return res.send(buffer);
    }
    async viewQRCode(filename, res) {
        if (!filename.match(/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg)$/)) {
            throw new common_1.BadRequestException('Nom de fichier invalide');
        }
        const relativePath = `/public/qr-codes/${filename}`;
        const buffer = await this.filesService.getFileBuffer(relativePath);
        if (!buffer) {
            return res.status(404).json({ message: 'QR Code non trouvé' });
        }
        res.set({
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
        });
        return res.send(buffer);
    }
};
exports.QrCodeController = QrCodeController;
__decorate([
    (0, common_1.Post)('table/:tableId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('tableId')),
    __param(1, (0, tenant_decorator_1.CurrentTenant)()),
    __param(2, (0, common_1.Query)('size')),
    __param(3, (0, common_1.Query)('margin')),
    __param(4, (0, common_1.Query)('dark_color')),
    __param(5, (0, common_1.Query)('light_color')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "generateTableQRCode", null);
__decorate([
    (0, common_1.Post)('menu'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('margin')),
    __param(3, (0, common_1.Query)('dark_color')),
    __param(4, (0, common_1.Query)('light_color')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "generateMenuQRCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('public/menu/:tenantSlug'),
    __param(0, (0, common_1.Param)('tenantSlug')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('margin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "generatePublicMenuQRCode", null);
__decorate([
    (0, common_1.Post)('tables/generate-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "generateAllTableQRCodes", null);
__decorate([
    (0, common_1.Post)('table/:tableId/regenerate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('tableId')),
    __param(1, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "regenerateTableQRCode", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "getQRCodeStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('download/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "downloadQRCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('view/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "viewQRCode", null);
exports.QrCodeController = QrCodeController = __decorate([
    (0, common_1.Controller)('qr-codes'),
    __metadata("design:paramtypes", [qr_code_service_1.QrCodeService,
        files_service_1.FilesService])
], QrCodeController);
//# sourceMappingURL=qr-code.controller.js.map