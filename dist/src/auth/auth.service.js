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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async register(registerDto) {
        const tenant = await this.prisma.tenant.findFirst({
            where: {
                id: registerDto.tenant_id,
                is_active: true,
            },
        });
        if (!tenant) {
            throw new common_1.BadRequestException('Tenant non trouvé ou inactif');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        await this.prisma.event.create({
            data: {
                tenant_id: user.tenant_id,
                user_id: user.id,
                event_type: 'USER_LOGIN',
                description: `Nouvel utilisateur créé: ${user.email}`,
                metadata: {
                    user_role: user.role,
                    registration_method: 'email',
                },
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            tenant_id: user.tenant_id,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                tenant_id: user.tenant_id,
                tenant: user.tenant,
            },
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        await this.prisma.event.create({
            data: {
                tenant_id: user.tenant_id,
                user_id: user.id,
                event_type: 'USER_LOGIN',
                description: `Connexion utilisateur: ${user.email}`,
                metadata: {
                    user_role: user.role,
                    login_method: 'email',
                },
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            tenant_id: user.tenant_id,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                tenant_id: user.tenant_id,
                tenant: user.tenant,
            },
        };
    }
    async logout(userId, tenantId) {
        await this.prisma.event.create({
            data: {
                tenant_id: tenantId,
                user_id: userId,
                event_type: 'USER_LOGOUT',
                description: 'Déconnexion utilisateur',
                metadata: {
                    logout_method: 'manual',
                },
            },
        });
        return { message: 'Déconnexion réussie' };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        is_active: true,
                    },
                },
            },
        });
        if (!user) {
            return null;
        }
        if (!user.is_active || !user.tenant.is_active) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        const { password: _, ...result } = user;
        return result;
    }
    async validateJwtPayload(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        is_active: true,
                    },
                },
            },
        });
        if (!user || !user.is_active || !user.tenant.is_active) {
            return null;
        }
        if (user.tenant_id !== payload.tenant_id || user.email !== payload.email) {
            return null;
        }
        const { password: _, ...result } = user;
        return result;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
                tenant_id: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        email: true,
                        phone: true,
                        address: true,
                        logo_url: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map