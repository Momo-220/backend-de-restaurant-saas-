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
var WaveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const crypto = require("crypto");
let WaveService = WaveService_1 = class WaveService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WaveService_1.name);
        this.apiUrl = this.configService.get('WAVE_API_URL', 'https://api.wave.com/v1');
        this.apiKey = this.configService.get('WAVE_API_KEY');
        this.secretKey = this.configService.get('WAVE_SECRET_KEY');
        this.merchantId = this.configService.get('WAVE_MERCHANT_ID');
        if (!this.apiKey || !this.secretKey || !this.merchantId) {
            this.logger.warn('Configuration Wave manquante. Paiements Wave désactivés.');
        }
    }
    async initiatePayment(paymentRequest) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('Configuration Wave manquante');
        }
        try {
            this.logger.log(`Initiation paiement Wave pour commande ${paymentRequest.order_id}`);
            const paymentData = {
                merchant_id: this.merchantId,
                reference: paymentRequest.order_id,
                amount: paymentRequest.amount,
                currency: paymentRequest.currency,
                description: paymentRequest.description,
                customer: {
                    phone: paymentRequest.customer_phone,
                    email: paymentRequest.customer_email,
                },
                callback_urls: {
                    success: paymentRequest.success_url,
                    cancel: paymentRequest.cancel_url,
                    webhook: paymentRequest.webhook_url,
                },
                metadata: {
                    order_id: paymentRequest.order_id,
                    timestamp: Date.now(),
                },
            };
            const signature = this.generateSignature(paymentData);
            const response = await axios_1.default.post(`${this.apiUrl}/payments/initialize`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Wave-Signature': signature,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            if (response.data.success || response.data.status === 'success') {
                this.logger.log(`Paiement Wave initié avec succès: ${response.data.transaction_id || response.data.id}`);
                return {
                    success: true,
                    transaction_id: response.data.transaction_id || response.data.id,
                    payment_url: response.data.payment_url || response.data.checkout_url,
                };
            }
            else {
                throw new common_1.BadRequestException(`Erreur Wave: ${response.data.message || response.data.error}`);
            }
        }
        catch (error) {
            this.logger.error(`Erreur initiation paiement Wave: ${error.message}`);
            if (error.response?.data?.message || error.response?.data?.error) {
                throw new common_1.BadRequestException(`Wave: ${error.response.data.message || error.response.data.error}`);
            }
            throw new common_1.BadRequestException('Erreur lors de l\'initiation du paiement Wave');
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
            this.logger.error(`Erreur vérification signature Wave: ${error.message}`);
            return false;
        }
    }
    async checkPaymentStatus(transactionId) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('Configuration Wave manquante');
        }
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/payments/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: 15000,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Erreur vérification statut Wave: ${error.message}`);
            throw new common_1.BadRequestException('Erreur lors de la vérification du statut');
        }
    }
    generateSignature(data) {
        const dataString = JSON.stringify(data);
        return crypto
            .createHmac('sha256', this.secretKey)
            .update(dataString)
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
exports.WaveService = WaveService;
exports.WaveService = WaveService = WaveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WaveService);
//# sourceMappingURL=wave.service.js.map