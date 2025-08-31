"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        console.log('✅ Base de données connectée');
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    forTenant(tenantId) {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map