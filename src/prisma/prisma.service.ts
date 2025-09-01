import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Base de données connectée avec succès');
    } catch (error) {
      this.logger.error('❌ Erreur de connexion à la base de données:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Connexion à la base de données fermée');
    } catch (error) {
      this.logger.error('❌ Erreur lors de la fermeture de la connexion:', error);
    }
  }

  // Méthode helper pour filtrer par tenant
  forTenant(tenantId: string) {
    return {
      user: this.user.findMany({ where: { tenant_id: tenantId } }),
      category: this.category.findMany({ where: { tenant_id: tenantId } }),
      item: this.item.findMany({ where: { tenant_id: tenantId } }),
      table: this.table.findMany({ where: { tenant_id: tenantId } }),
      order: this.order.findMany({ where: { tenant_id: tenantId } }),
      payment: this.payment.findMany({ where: { tenant_id: tenantId } }),
      event: this.event.findMany({ where: { tenant_id: tenantId } }),
    };
  }
}












