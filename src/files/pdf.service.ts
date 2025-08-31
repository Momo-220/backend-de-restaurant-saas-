import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from './files.service';
import * as puppeteer from 'puppeteer';

export interface ReceiptData {
  order: {
    id: string;
    order_number: string;
    customer_name?: string;
    customer_phone?: string;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: Date;
    notes?: string;
    table?: {
      number: string;
      name?: string;
    };
  };
  restaurant: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    logo_url?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes?: string;
  }>;
}

@Injectable()
export class PdfService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async generateOrderReceipt(orderId: string, tenantId: string): Promise<string> {
    // Récupérer les données de la commande
    const receiptData = await this.getOrderReceiptData(orderId, tenantId);
    
    // Générer le HTML du reçu
    const htmlContent = this.generateReceiptHTML(receiptData);
    
    // Convertir en PDF
    const pdfBuffer = await this.htmlToPdf(htmlContent);
    
    // Sauvegarder le fichier
    const filename = this.filesService.generateUniqueFilename(
      `receipt_${receiptData.order.order_number}.pdf`,
      'receipt'
    );
    const relativePath = await this.filesService.saveFile(pdfBuffer, filename, 'receipts');
    
    return relativePath;
  }

  private async getOrderReceiptData(orderId: string, tenantId: string): Promise<ReceiptData> {
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
      throw new BadRequestException('Commande non trouvée');
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

  private generateReceiptHTML(data: ReceiptData): string {
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

  private async htmlToPdf(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        width: '80mm', // Format ticket de caisse
        margin: {
          top: '10mm',
          bottom: '10mm',
          left: '5mm',
          right: '5mm',
        },
        printBackground: true,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      CASH: 'Espèces',
      CARD: 'Carte bancaire',
      MOBILE: 'Paiement mobile',
      WAVE: 'Wave',
      MYNITA: 'MyNita',
    };
    return labels[method] || method;
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      ACCEPTED: 'Acceptée',
      PREPARING: 'En préparation',
      READY: 'Prête',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée',
    };
    return labels[status] || status;
  }

  async generateCustomPdf(htmlContent: string, filename: string): Promise<string> {
    const pdfBuffer = await this.htmlToPdf(htmlContent);
    const relativePath = await this.filesService.saveFile(pdfBuffer, filename, 'receipts');
    return relativePath;
  }

  async getPdfStats(tenantId: string) {
    const [
      totalReceipts,
      recentReceipts,
    ] = await Promise.all([
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
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours
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
}












