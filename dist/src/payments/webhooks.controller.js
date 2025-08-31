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
var WebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const payments_service_1 = require("./payments.service");
let WebhooksController = WebhooksController_1 = class WebhooksController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
        this.logger = new common_1.Logger(WebhooksController_1.name);
    }
    async handleMyNitaWebhook(body, signature) {
        this.logger.log('Webhook MyNita reçu');
        try {
            const callbackData = {
                transaction_id: body.transaction_id || body.id,
                order_id: body.order_id || body.reference,
                status: this.mapMyNitaStatus(body.status),
                amount: body.amount,
                currency: body.currency,
                payment_method: 'MYNITA',
                provider_reference: body.mynita_reference || body.reference,
                message: body.message || body.description,
            };
            await this.paymentsService.handlePaymentCallback('mynita', callbackData, signature);
            return {
                success: true,
                message: 'Webhook MyNita traité avec succès',
            };
        }
        catch (error) {
            this.logger.error(`Erreur webhook MyNita: ${error.message}`);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async handleWaveWebhook(body, signature) {
        this.logger.log('Webhook Wave reçu');
        try {
            const callbackData = {
                transaction_id: body.id || body.transaction_id,
                order_id: body.metadata?.order_id || body.reference,
                status: this.mapWaveStatus(body.status),
                amount: body.amount,
                currency: body.currency,
                payment_method: 'WAVE',
                provider_reference: body.wave_reference || body.id,
                message: body.message || body.status_message,
            };
            await this.paymentsService.handlePaymentCallback('wave', callbackData, signature);
            return {
                success: true,
                message: 'Webhook Wave traité avec succès',
            };
        }
        catch (error) {
            this.logger.error(`Erreur webhook Wave: ${error.message}`);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async handleTestWebhook(provider, body) {
        this.logger.log(`Webhook test ${provider} reçu`);
        try {
            const callbackData = {
                transaction_id: body.transaction_id,
                order_id: body.order_id,
                status: body.status,
                amount: body.amount,
                currency: body.currency || 'XOF',
                payment_method: provider.toUpperCase(),
                provider_reference: body.provider_reference,
                message: body.message,
            };
            await this.paymentsService.handlePaymentCallback(provider, callbackData);
            return {
                success: true,
                message: `Webhook test ${provider} traité avec succès`,
            };
        }
        catch (error) {
            this.logger.error(`Erreur webhook test ${provider}: ${error.message}`);
            throw new common_1.BadRequestException(error.message);
        }
    }
    mapMyNitaStatus(mynitaStatus) {
        switch (mynitaStatus?.toLowerCase()) {
            case 'success':
            case 'completed':
            case 'paid':
                return 'SUCCESS';
            case 'failed':
            case 'error':
                return 'FAILED';
            case 'cancelled':
            case 'canceled':
                return 'CANCELLED';
            case 'pending':
            case 'processing':
            default:
                return 'PENDING';
        }
    }
    mapWaveStatus(waveStatus) {
        switch (waveStatus?.toLowerCase()) {
            case 'success':
            case 'successful':
            case 'completed':
            case 'paid':
                return 'SUCCESS';
            case 'failed':
            case 'error':
            case 'declined':
                return 'FAILED';
            case 'cancelled':
            case 'canceled':
                return 'CANCELLED';
            case 'pending':
            case 'processing':
            case 'initiated':
            default:
                return 'PENDING';
        }
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('mynita'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-mynita-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleMyNitaWebhook", null);
__decorate([
    (0, common_1.Post)('wave'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-wave-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleWaveWebhook", null);
__decorate([
    (0, common_1.Post)('test/:provider'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleTestWebhook", null);
exports.WebhooksController = WebhooksController = WebhooksController_1 = __decorate([
    (0, common_1.Controller)('payments/webhooks'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map