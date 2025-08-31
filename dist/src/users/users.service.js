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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto, creatorTenantId) {
        if (createUserDto.tenant_id !== creatorTenantId) {
            throw new common_1.ForbiddenException('Vous ne pouvez créer des utilisateurs que dans votre tenant');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
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
                    },
                },
            },
        });
    }
    async findAllByTenant(tenantId) {
        return this.prisma.user.findMany({
            where: { tenant_id: tenantId },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id, tenantId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
                tenant_id: tenantId,
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async update(id, updateUserDto, tenantId) {
        await this.findOne(id, tenantId);
        if (updateUserDto.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: updateUserDto.email,
                    id: { not: id },
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.user.update({
            where: { id },
            data: { is_active: false },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                is_active: true,
            },
        });
    }
    async changePassword(userId, changePasswordDto, tenantId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
                tenant_id: tenantId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.current_password, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.ForbiddenException('Mot de passe actuel incorrect');
        }
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(changePasswordDto.new_password, saltRounds);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        await this.prisma.event.create({
            data: {
                tenant_id: tenantId,
                user_id: userId,
                event_type: 'SYSTEM_EVENT',
                description: 'Mot de passe modifié',
                metadata: {
                    action: 'password_change',
                },
            },
        });
        return { message: 'Mot de passe modifié avec succès' };
    }
    async getUserStats(tenantId) {
        const [totalUsers, activeUsers, usersByRole] = await Promise.all([
            this.prisma.user.count({ where: { tenant_id: tenantId } }),
            this.prisma.user.count({ where: { tenant_id: tenantId, is_active: true } }),
            this.prisma.user.groupBy({
                by: ['role'],
                where: { tenant_id: tenantId, is_active: true },
                _count: { role: true },
            }),
        ]);
        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            usersByRole: usersByRole.reduce((acc, item) => {
                acc[item.role] = item._count.role;
                return acc;
            }, {}),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map