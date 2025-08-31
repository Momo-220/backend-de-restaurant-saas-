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
var MyNitaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyNitaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const crypto = require("crypto");
let MyNitaService = MyNitaService_1 = class MyNitaService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MyNitaService_1.name);
        this.apiUrl = this.configService.get('MYNITA_API_URL', 'https://api.mynita.com/v1');
        this.apiKey = this.configService.get('MYNITA_API_KEY');
        this.secretKey = this.configService.get('MYNITA_SECRET_KEY');
        this.merchantId = this.configService.get('MYNITA_MERCHANT_ID');
        if (!this.apiKey || !this.secretKey || !this.merchantId) {
            this.logger.warn('Configuration MyNita manquante. Paiements MyNita désactivés.');
        }
    }
    async initiatePayment(paymentRequest) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('Configuration MyNita manquante');
        }
        try {
            this.logger.log(`Initiation paiement MyNita pour commande ${paymentRequest.order_id}`);
            const paymentData = {
                merchant_id: this.merchantId,
                order_id: paymentRequest.order_id,
                amount: paymentRequest.amount,
                currency: paymentRequest.currency,
                description: paymentRequest.description,
                customer_phone: paymentRequest.customer_phone,
                customer_email: paymentRequest.customer_email,
                success_url: paymentRequest.success_url,
                cancel_url: paymentRequest.cancel_url,
                webhook_url: paymentRequest.webhook_url,
                timestamp: Date.now(),
            };
            const signature = this.generateSignature(paymentData);
            paymentData['signature'] = signature;
            const response = await axios_1.default.post(`${this.apiUrl}/payments/initiate`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            if (response.data.success) {
                this.logger.log(`Paiement MyNita initié avec succès: ${response.data.transaction_id}`);
                return {
                    success: true,
                    transaction_id: response.data.transaction_id,
                    payment_url: response.data.payment_url,
                };
            }
            else {
                throw new common_1.BadRequestException(`Erreur MyNita: ${response.data.message}`);
            }
        }
        catch (error) {
            this.logger.error(`Erreur initiation paiement MyNita: ${error.message}`);
            if (error.response?.data?.message) {
                throw new common_1.BadRequestException(`MyNita: ${error.response.data.message}`);
            }
            throw new common_1.BadRequestException('Erreur lors de l\'initiation du paiement MyNita');
        }
    }
    verifyWebhookSignature(payload, receivedSignature) {
        if (!this.isConfigured()) {
            return false;
        }
        try {
            const expectedSignature = this.generateSignature(payload);
            return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature));
        }
        catch (error) {
            this.logger.error(`Erreur vérification signature MyNita: ${error.message}`);
            return false;
        }
    }
    async checkPaymentStatus(transactionId) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('Configuration MyNita manquante');
        }
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/payments/${transactionId}/status`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: 15000,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Erreur vérification statut MyNita: ${error.message}`);
            throw new common_1.BadRequestException('Erreur lors de la vérification du statut');
        }
    }
    generateSignature(data) {
        const sortedKeys = Object.keys(data).sort();
        const queryString = sortedKeys
            .filter(key => key !== 'signature' && data[key] !== null && data[key] !== undefined)
            .map(key => `${key}=${data[key]}`)
            .join('&');
        return crypto
            .createHmac('sha256', this.secretKey)
            .update(queryString)
            .digest('hex');
    }
    isConfigured() {
        return !!(this.apiKey && this.secretKey && this.merchantId);
    }
    getConfigStatus() {
        return {
            configured: this.isConfigured(),
            api_url: this.apiUrl,
            merchant_id: this.merchantId ? '***' + this.merchantId.slice(-4) : null,
        };
    }
};
exports.MyNitaService = MyNitaService;
exports.MyNitaService = MyNitaService = MyNitaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MyNitaService);
//# sourceMappingURL=mynita.service.js.map