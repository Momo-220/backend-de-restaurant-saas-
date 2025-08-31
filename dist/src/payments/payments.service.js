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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_service_1 = require("../orders/orders.service");
const websocket_service_1 = require("../websocket/websocket.service");
const mynita_service_1 = require("./providers/mynita.service");
const wave_service_1 = require("./providers/wave.service");
const payment_callback_dto_1 = require("./dto/payment-callback.dto");
const order_types_1 = require("../common/types/order.types");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, ordersService, websocketService, mynitaService, waveService, configService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
        this.websocketService = websocketService;
        this.mynitaService = mynitaService;
        this.waveService = waveService;
        this.configService = configService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3001');
    }
    async initiatePayment(orderId, paymentDto, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                tenant_id: tenantId,
                status: order_types_1.OrderStatus.PENDING,
            },
            include: {
                tenant: true,
                table: true,
                order_items: {
                    include: {
                        item: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Commande non trouvée ou déjà traitée');
        }
        const existingPayment = await this.prisma.payment.findFirst({
            where: {
                order_id: orderId,
                status: {
                    in: ['PENDING', 'SUCCESS'],
                },
            },
        });
        if (existingPayment) {
            throw new common_1.ConflictException('Un paiement est déjà en cours ou terminé pour cette commande');
        }
        try {
            const baseUrl = this.configService.get('APP_URL', 'http://localhost:3000');
            const successUrl = paymentDto.success_url || `${this.frontendUrl}/payment/success?order_id=${orderId}`;
            const cancelUrl = paymentDto.cancel_url || `${this.frontendUrl}/payment/cancel?order_id=${orderId}`;
            const webhookUrl = `${baseUrl}/api/v1/payments/webhooks/${paymentDto.payment_method.toLowerCase()}`;
            const commonPaymentData = {
                order_id: orderId,
                amount: Number(order.total_amount),
                currency: 'XOF',
                description: `Commande #${order.order_number} - ${order.tenant.name}`,
                customer_phone: paymentDto.customer_phone,
                customer_email: paymentDto.customer_email,
                success_url: successUrl,
                cancel_url: cancelUrl,
                webhook_url: webhookUrl,
            };
            let paymentResult;
            switch (paymentDto.payment_method) {
                case order_types_1.PaymentMethod.MYNITA:
                    paymentResult = await this.mynitaService.initiatePayment(commonPaymentData);
                    break;
                case order_types_1.PaymentMethod.WAVE:
                    paymentResult = await this.waveService.initiatePayment(commonPaymentData);
                    break;
                default:
                    throw new common_1.BadRequestException('Méthode de paiement non supportée');
            }
            if (!paymentResult.success) {
                throw new common_1.BadRequestException('Échec de l\'initiation du paiement');
            }
            const payment = await this.prisma.payment.create({
                data: {
                    order_id: orderId,
                    tenant_id: tenantId,
                    method: paymentDto.payment_method,
                    amount: Number(order.total_amount),
                    currency: 'XOF',
                    status: 'PENDING',
                    transaction_id: paymentResult.transaction_id,
                    provider_data: {
                        payment_url: paymentResult.payment_url,
                        success_url: successUrl,
                        cancel_url: cancelUrl,
                        webhook_url: webhookUrl,
                    },
                    expires_at: new Date(Date.now() + 30 * 60 * 1000),
                },
            });
            this.logger.log(`Paiement initié: ${payment.id} pour commande ${orderId}`);
            this.websocketService.emitPaymentInitiated(tenantId, {
                order_id: orderId,
                payment_id: payment.id,
                payment_method: paymentDto.payment_method,
                amount: Number(order.total_amount),
            });
            return {
                success: true,
                payment_url: paymentResult.payment_url,
                transaction_id: paymentResult.transaction_id,
                order_id: orderId,
                payment_method: paymentDto.payment_method,
                expires_at: payment.expires_at,
            };
        }
        catch (error) {
            this.logger.error(`Erreur initiation paiement: ${error.message}`);
            throw error;
        }
    }
    async handlePaymentCallback(provider, callbackData, signature) {
        this.logger.log(`Callback paiement reçu de ${provider}: ${callbackData.transaction_id}`);
        try {
            let signatureValid = false;
            switch (provider.toLowerCase()) {
                case 'mynita':
                    signatureValid = signature ? this.mynitaService.verifyWebhookSignature(callbackData, signature) : true;
                    break;
                case 'wave':
                    signatureValid = signature ? this.waveService.verifyWebhookSignature(callbackData, signature) : true;
                    break;
                default:
                    throw new common_1.BadRequestException('Provider de paiement non reconnu');
            }
            if (signature && !signatureValid) {
                this.logger.warn(`Signature invalide pour callback ${provider}: ${callbackData.transaction_id}`);
                throw new common_1.BadRequestException('Signature invalide');
            }
            const payment = await this.prisma.payment.findFirst({
                where: {
                    transaction_id: callbackData.transaction_id,
                },
                include: {
                    order: {
                        include: {
                            tenant: true,
                        },
                    },
                },
            });
            if (!payment) {
                throw new common_1.NotFoundException('Paiement non trouvé');
            }
            const updatedPayment = await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: this.mapProviderStatusToPaymentStatus(callbackData.status),
                    provider_reference: callbackData.provider_reference,
                    provider_data: {
                        ...payment.provider_data,
                        callback_data: callbackData,
                        processed_at: new Date(),
                    },
                },
            });
            if (callbackData.status === payment_callback_dto_1.PaymentStatus.SUCCESS) {
                await this.validateOrderPayment(payment.order_id, payment.tenant_id);
                this.logger.log(`Paiement réussi: ${payment.id} - Commande ${payment.order_id} validée`);
                this.websocketService.emitPaymentSuccess(payment.tenant_id, {
                    order_id: payment.order_id,
                    payment_id: payment.id,
                    transaction_id: callbackData.transaction_id,
                    amount: payment.amount,
                });
            }
            else if (callbackData.status === payment_callback_dto_1.PaymentStatus.FAILED || callbackData.status === payment_callback_dto_1.PaymentStatus.CANCELLED) {
                this.logger.log(`Paiement échoué/annulé: ${payment.id} - Commande ${payment.order_id}`);
                this.websocketService.emitPaymentFailed(payment.tenant_id, {
                    order_id: payment.order_id,
                    payment_id: payment.id,
                    transaction_id: callbackData.transaction_id,
                    reason: callbackData.message || 'Paiement échoué',
                });
            }
        }
        catch (error) {
            this.logger.error(`Erreur traitement callback paiement: ${error.message}`);
            throw error;
        }
    }
    async validateOrderPayment(orderId, tenantId) {
        try {
            await this.ordersService.updateStatus(orderId, { status: order_types_1.OrderStatus.PREPARING }, tenantId);
            this.logger.log(`Commande ${orderId} confirmée après paiement réussi`);
        }
        catch (error) {
            this.logger.error(`Erreur validation commande ${orderId}: ${error.message}`);
            throw error;
        }
    }
    async getPayment(paymentId, tenantId) {
        const payment = await this.prisma.payment.findFirst({
            where: {
                id: paymentId,
                tenant_id: tenantId,
            },
            include: {
                order: {
                    include: {
                        table: true,
                        order_items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Paiement non trouvé');
        }
        return payment;
    }
    async getPayments(tenantId, filters = {}) {
        const where = { tenant_id: tenantId };
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.method) {
            where.method = filters.method;
        }
        if (filters.from_date) {
            where.created_at = { ...where.created_at, gte: new Date(filters.from_date) };
        }
        if (filters.to_date) {
            where.created_at = { ...where.created_at, lte: new Date(filters.to_date) };
        }
        const payments = await this.prisma.payment.findMany({
            where,
            include: {
                order: {
                    select: {
                        order_number: true,
                        total_amount: true,
                        table: {
                            select: {
                                number: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
            take: filters.limit || 50,
            skip: filters.offset || 0,
        });
        return payments;
    }
    async getPaymentStats(tenantId) {
        const [totalPayments, successfulPayments, pendingPayments, failedPayments] = await Promise.all([
            this.prisma.payment.count({
                where: { tenant_id: tenantId },
            }),
            this.prisma.payment.count({
                where: { tenant_id: tenantId, status: 'SUCCESS' },
            }),
            this.prisma.payment.count({
                where: { tenant_id: tenantId, status: 'PENDING' },
            }),
            this.prisma.payment.count({
                where: { tenant_id: tenantId, status: { in: ['FAILED', 'CANCELLED'] } },
            }),
        ]);
        const totalRevenue = await this.prisma.payment.aggregate({
            where: {
                tenant_id: tenantId,
                status: 'SUCCESS',
            },
            _sum: {
                amount: true,
            },
        });
        const paymentsByMethod = await this.prisma.payment.groupBy({
            by: ['method'],
            where: { tenant_id: tenantId },
            _count: true,
        });
        return {
            total_payments: totalPayments,
            successful_payments: successfulPayments,
            pending_payments: pendingPayments,
            failed_payments: failedPayments,
            success_rate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
            total_revenue: totalRevenue._sum.amount || 0,
            payments_by_method: paymentsByMethod,
        };
    }
    mapProviderStatusToPaymentStatus(providerStatus) {
        switch (providerStatus) {
            case payment_callback_dto_1.PaymentStatus.SUCCESS:
                return 'SUCCESS';
            case payment_callback_dto_1.PaymentStatus.FAILED:
                return 'FAILED';
            case payment_callback_dto_1.PaymentStatus.CANCELLED:
                return 'CANCELLED';
            case payment_callback_dto_1.PaymentStatus.PENDING:
            default:
                return 'PENDING';
        }
    }
    getProvidersStatus() {
        return {
            mynita: this.mynitaService.getConfigStatus(),
            wave: this.waveService.getConfigStatus(),
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService,
        websocket_service_1.WebSocketService,
        mynita_service_1.MyNitaService,
        wave_service_1.WaveService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map