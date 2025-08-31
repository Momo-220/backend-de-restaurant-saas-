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
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const files_service_1 = require("./files.service");
const puppeteer = require("puppeteer");
let PdfService = class PdfService {
    constructor(configService, prisma, filesService) {
        this.configService = configService;
        this.prisma = prisma;
        this.filesService = filesService;
    }
    async generateOrderReceipt(orderId, tenantId) {
        const receiptData = await this.getOrderReceiptData(orderId, tenantId);
        const htmlContent = this.generateReceiptHTML(receiptData);
        const pdfBuffer = await this.htmlToPdf(htmlContent);
        const filename = this.filesService.generateUniqueFilename(`receipt_${receiptData.order.order_number}.pdf`, 'receipt');
        const relativePath = await this.filesService.saveFile(pdfBuffer, filename, 'receipts');
        return relativePath;
    }
    async getOrderReceiptData(orderId, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                tenant_id: tenantId,
            },
            include: {
                table: {
                    select: {
                        number: true,
                        name: true,
                    },
                },
                tenant: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        logo_url: true,
                    },
                },
                order_items: {
                    include: {
                        item: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.BadRequestException('Commande non trouvée');
        }
        return {
            order: {
                id: order.id,
                order_number: order.order_number,
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                total_amount: parseFloat(order.total_amount.toString()),
                payment_method: order.payment_method,
                status: order.status,
                created_at: order.created_at,
                notes: order.notes,
                table: order.table ? {
                    number: order.table.number,
                    name: order.table.name,
                } : undefined,
            },
            restaurant: {
                name: order.tenant.name,
                email: order.tenant.email,
                phone: order.tenant.phone,
                address: order.tenant.address,
                logo_url: order.tenant.logo_url,
            },
            items: order.order_items.map(item => ({
                name: item.item.name,
                quantity: item.quantity,
                unit_price: parseFloat(item.unit_price.toString()),
                total_price: parseFloat(item.total_price.toString()),
                notes: item.notes,
            })),
        };
    }
    generateReceiptHTML(data) {
        const { order, restaurant, items } = data;
        return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reçu - ${order.order_number}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #333;
                max-width: 300px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding-bottom: 15px;
            }
            
            .logo {
                max-width: 80px;
                max-height: 80px;
                margin-bottom: 10px;
            }
            
            .restaurant-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .restaurant-info {
                font-size: 10px;
                color: #666;
                line-height: 1.3;
            }
            
            .order-info {
                margin: 20px 0;
                padding: 15px 0;
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
            }
            
            .order-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            
            .order-number {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            }
            
            .items {
                margin: 20px 0;
            }
            
            .item {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px dotted #ccc;
            }
            
            .item:last-child {
                border-bottom: none;
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                margin-bottom: 3px;
            }
            
            .item-details {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #666;
            }
            
            .item-notes {
                font-size: 10px;
                color: #888;
                font-style: italic;
                margin-top: 3px;
            }
            
            .total-section {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 2px solid #333;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .total-final {
                font-size: 16px;
                font-weight: bold;
                border-top: 1px solid #333;
                padding-top: 8px;
                margin-top: 8px;
            }
            
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                font-size: 10px;
                color: #666;
            }
            
            .payment-info {
                margin: 15px 0;
                text-align: center;
                font-weight: bold;
            }
            
            .thank-you {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            ${restaurant.logo_url ? `<img src="${restaurant.logo_url}" alt="Logo" class="logo">` : ''}
            <div class="restaurant-name">${restaurant.name}</div>
            <div class="restaurant-info">
                ${restaurant.address || ''}<br>
                ${restaurant.phone || ''}<br>
                ${restaurant.email || ''}
            </div>
        </div>

        <div class="order-number">
            Commande N° ${order.order_number}
        </div>

        <div class="order-info">
            <div class="order-row">
                <span>Date:</span>
                <span>${new Date(order.created_at).toLocaleString('fr-FR')}</span>
            </div>
            ${order.table ? `
            <div class="order-row">
                <span>Table:</span>
                <span>${order.table.number}${order.table.name ? ` (${order.table.name})` : ''}</span>
            </div>
            ` : ''}
            ${order.customer_name ? `
            <div class="order-row">
                <span>Client:</span>
                <span>${order.customer_name}</span>
            </div>
            ` : ''}
            ${order.customer_phone ? `
            <div class="order-row">
                <span>Téléphone:</span>
                <span>${order.customer_phone}</span>
            </div>
            ` : ''}
        </div>

        <div class="items">
            ${items.map(item => `
                <div class="item">
                    <div class="item-header">
                        <span>${item.name}</span>
                        <span>${item.total_price.toFixed(2)}€</span>
                    </div>
                    <div class="item-details">
                        <span>${item.quantity} × ${item.unit_price.toFixed(2)}€</span>
                    </div>
                    ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="total-section">
            <div class="total-row total-final">
                <span>TOTAL</span>
                <span>${order.total_amount.toFixed(2)}€</span>
            </div>
        </div>

        <div class="payment-info">
            Paiement: ${this.getPaymentMethodLabel(order.payment_method)}
        </div>

        ${order.notes ? `
        <div style="margin: 15px 0; padding: 10px; background: #f9f9f9; border-left: 3px solid #333;">
            <strong>Notes:</strong><br>
            ${order.notes}
        </div>
        ` : ''}

        <div class="thank-you">
            Merci de votre visite !
        </div>

        <div class="footer">
            Reçu généré le ${new Date().toLocaleString('fr-FR')}<br>
            Statut: ${this.getStatusLabel(order.status)}
        </div>
    </body>
    </html>
    `;
    }
    async htmlToPdf(htmlContent) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        try {
            const page = await browser.newPage();
            await page.setContent(htmlContent);
            const pdfBuffer = await page.pdf({
                format: 'A4',
                width: '80mm',
                margin: {
                    top: '10mm',
                    bottom: '10mm',
                    left: '5mm',
                    right: '5mm',
                },
                printBackground: true,
            });
            return Buffer.from(pdfBuffer);
        }
        finally {
            await browser.close();
        }
    }
    getPaymentMethodLabel(method) {
        const labels = {
            CASH: 'Espèces',
            CARD: 'Carte bancaire',
            MOBILE: 'Paiement mobile',
            WAVE: 'Wave',
            MYNITA: 'MyNita',
        };
        return labels[method] || method;
    }
    getStatusLabel(status) {
        const labels = {
            PENDING: 'En attente',
            ACCEPTED: 'Acceptée',
            PREPARING: 'En préparation',
            READY: 'Prête',
            DELIVERED: 'Livrée',
            CANCELLED: 'Annulée',
        };
        return labels[status] || status;
    }
    async generateCustomPdf(htmlContent, filename) {
        const pdfBuffer = await this.htmlToPdf(htmlContent);
        const relativePath = await this.filesService.saveFile(pdfBuffer, filename, 'receipts');
        return relativePath;
    }
    async getPdfStats(tenantId) {
        const [totalReceipts, recentReceipts,] = await Promise.all([
            this.prisma.order.count({
                where: {
                    tenant_id: tenantId,
                    status: 'DELIVERED',
                },
            }),
            this.prisma.order.findMany({
                where: {
                    tenant_id: tenantId,
                    status: 'DELIVERED',
                    created_at: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
                select: {
                    id: true,
                    order_number: true,
                    total_amount: true,
                    created_at: true,
                },
                orderBy: { created_at: 'desc' },
                take: 10,
            }),
        ]);
        return {
            totalReceipts,
            recentReceipts,
        };
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        files_service_1.FilesService])
], PdfService);
//# sourceMappingURL=pdf.service.js.map