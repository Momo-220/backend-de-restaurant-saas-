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
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
let TenantMiddleware = class TenantMiddleware {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async use(req, res, next) {
        try {
            let tenantId = this.extractTenantId(req);
            if (!tenantId) {
                tenantId = this.extractTenantFromJWT(req);
            }
            if (tenantId) {
                const tenant = await this.prisma.tenant.findFirst({
                    where: {
                        id: tenantId,
                        is_active: true,
                    },
                    select: {
                        id: true,
                        slug: true,
                        name: true,
                    },
                });
                if (!tenant) {
                    throw new common_1.UnauthorizedException('Tenant non trouvé ou inactif');
                }
                req.tenant = tenant;
                if (req.user && req.user.tenant_id !== tenantId) {
                    throw new common_1.UnauthorizedException('Accès non autorisé à ce tenant');
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
    extractTenantId(req) {
        const headerTenant = req.headers['x-tenant-id'];
        if (headerTenant)
            return headerTenant;
        const slugParam = req.params.slug;
        if (slugParam) {
            return null;
        }
        const queryTenant = req.query.tenant_id;
        if (queryTenant)
            return queryTenant;
        return null;
    }
    extractTenantFromJWT(req) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return null;
            }
            const token = authHeader.substring(7);
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            return payload.tenant_id || null;
        }
        catch (error) {
            return null;
        }
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map