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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantsService = class TenantsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTenantDto) {
        const existingTenant = await this.prisma.tenant.findFirst({
            where: {
                OR: [
                    { slug: createTenantDto.slug },
                    { email: createTenantDto.email },
                ],
            },
        });
        if (existingTenant) {
            if (existingTenant.slug === createTenantDto.slug) {
                throw new common_1.ConflictException('Ce slug est déjà utilisé');
            }
            if (existingTenant.email === createTenantDto.email) {
                throw new common_1.ConflictException('Cet email est déjà utilisé');
            }
        }
        return this.prisma.tenant.create({
            data: createTenantDto,
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                phone: true,
                address: true,
                logo_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async findAll() {
        return this.prisma.tenant.findMany({
            where: { is_active: true },
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                phone: true,
                address: true,
                logo_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                phone: true,
                address: true,
                logo_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant non trouvé');
        }
        return tenant;
    }
    async findBySlug(slug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                phone: true,
                address: true,
                logo_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Restaurant non trouvé');
        }
        if (!tenant.is_active) {
            throw new common_1.NotFoundException('Restaurant non disponible');
        }
        return tenant;
    }
    async update(id, updateTenantDto) {
        await this.findOne(id);
        if (updateTenantDto.slug || updateTenantDto.email) {
            const conditions = [];
            if (updateTenantDto.slug)
                conditions.push({ slug: updateTenantDto.slug });
            if (updateTenantDto.email)
                conditions.push({ email: updateTenantDto.email });
            const existingTenant = await this.prisma.tenant.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        { OR: conditions },
                    ],
                },
            });
            if (existingTenant) {
                if (existingTenant.slug === updateTenantDto.slug) {
                    throw new common_1.ConflictException('Ce slug est déjà utilisé');
                }
                if (existingTenant.email === updateTenantDto.email) {
                    throw new common_1.ConflictException('Cet email est déjà utilisé');
                }
            }
        }
        return this.prisma.tenant.update({
            where: { id },
            data: updateTenantDto,
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                phone: true,
                address: true,
                logo_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.tenant.update({
            where: { id },
            data: { is_active: false },
            select: {
                id: true,
                name: true,
                slug: true,
                is_active: true,
            },
        });
    }
    async getTenantStats(tenantId) {
        const [totalOrders, totalRevenue, totalItems, totalTables, activeOrders,] = await Promise.all([
            this.prisma.order.count({ where: { tenant_id: tenantId } }),
            this.prisma.order.aggregate({
                where: { tenant_id: tenantId, status: 'DELIVERED' },
                _sum: { total_amount: true },
            }),
            this.prisma.item.count({ where: { tenant_id: tenantId, is_available: true } }),
            this.prisma.table.count({ where: { tenant_id: tenantId, is_active: true } }),
            this.prisma.order.count({
                where: {
                    tenant_id: tenantId,
                    status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] },
                },
            }),
        ]);
        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.total_amount || 0,
            totalItems,
            totalTables,
            activeOrders,
        };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map