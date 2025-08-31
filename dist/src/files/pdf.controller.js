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
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("./pdf.service");
const files_service_1 = require("./files.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const user_types_1 = require("../common/types/user.types");
let PdfController = class PdfController {
    constructor(pdfService, filesService) {
        this.pdfService = pdfService;
        this.filesService = filesService;
    }
    async generateOrderReceipt(orderId, tenant) {
        const pdfUrl = await this.pdfService.generateOrderReceipt(orderId, tenant.id);
        return {
            order_id: orderId,
            pdf_url: pdfUrl,
            public_url: this.filesService.getPublicUrl(pdfUrl),
            download_url: `/api/v1/pdf/download/${pdfUrl.split('/').pop()}`,
        };
    }
    async getPdfStats(tenant) {
        return this.pdfService.getPdfStats(tenant.id);
    }
    async downloadPdf(filename, res) {
        if (!filename.match(/^[a-zA-Z0-9_-]+\.pdf$/)) {
            throw new common_1.BadRequestException('Nom de fichier invalide');
        }
        const relativePath = `/public/receipts/${filename}`;
        const buffer = await this.filesService.getFileBuffer(relativePath);
        if (!buffer) {
            return res.status(404).json({ message: 'PDF non trouvé' });
        }
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'private, max-age=3600',
        });
        return res.send(buffer);
    }
    async viewPdf(filename, res) {
        if (!filename.match(/^[a-zA-Z0-9_-]+\.pdf$/)) {
            throw new common_1.BadRequestException('Nom de fichier invalide');
        }
        const relativePath = `/public/receipts/${filename}`;
        const buffer = await this.filesService.getFileBuffer(relativePath);
        if (!buffer) {
            return res.status(404).json({ message: 'PDF non trouvé' });
        }
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
            'Cache-Control': 'private, max-age=3600',
        });
        return res.send(buffer);
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Post)('receipt/order/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER, user_types_1.UserRole.STAFF),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateOrderReceipt", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "getPdfStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('download/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "downloadPdf", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('view/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "viewPdf", null);
exports.PdfController = PdfController = __decorate([
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService,
        files_service_1.FilesService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map