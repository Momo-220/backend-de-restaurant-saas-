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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const websocket_service_1 = require("./websocket.service");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersGateway = class OrdersGateway {
    constructor(jwtService, configService, webSocketService, prisma) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.webSocketService = webSocketService;
        this.prisma = prisma;
    }
    afterInit(server) {
        this.webSocketService.setServer(server);
        console.log('🔌 WebSocket Gateway initialisé pour les commandes');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                console.log('❌ Client WebSocket sans token, déconnexion');
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    tenant_id: true,
                    is_active: true,
                    tenant: {
                        select: {
                            id: true,
                            is_active: true,
                        },
                    },
                },
            });
            if (!user || !user.is_active || !user.tenant.is_active) {
                console.log('❌ Utilisateur WebSocket invalide, déconnexion');
                client.disconnect();
                return;
            }
            client.user = {
                id: user.id,
                tenant_id: user.tenant_id,
                role: user.role,
                email: user.email,
            };
            await client.join(`tenant_${user.tenant_id}`);
            await client.join(`tenant_${user.tenant_id}_${user.role}`);
            await client.join(`user_${user.id}`);
            if (user.role === 'STAFF') {
                await client.join(`tenant_${user.tenant_id}_kitchen`);
            }
            console.log(`✅ Client WebSocket connecté: ${user.email} (${user.role}) - Tenant: ${user.tenant_id}`);
            const activeOrders = await this.prisma.order.findMany({
                where: {
                    tenant_id: user.tenant_id,
                    status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] },
                },
                select: {
                    id: true,
                    order_number: true,
                    customer_name: true,
                    status: true,
                    total_amount: true,
                    created_at: true,
                    table: {
                        select: {
                            number: true,
                            name: true,
                        },
                    },
                    _count: {
                        select: {
                            order_items: true,
                        },
                    },
                },
                orderBy: { created_at: 'asc' },
            });
            client.emit('active_orders', activeOrders);
        }
        catch (error) {
            console.log('❌ Erreur authentification WebSocket:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.user) {
            console.log(`👋 Client WebSocket déconnecté: ${client.user.email}`);
        }
    }
    handleJoinKitchen(client) {
        if (client.user) {
            client.join(`tenant_${client.user.tenant_id}_kitchen`);
            console.log(`🍳 ${client.user.email} a rejoint la cuisine`);
        }
    }
    handleLeaveKitchen(client) {
        if (client.user) {
            client.leave(`tenant_${client.user.tenant_id}_kitchen`);
            console.log(`🚪 ${client.user.email} a quitté la cuisine`);
        }
    }
    async handleGetActiveOrders(client) {
        if (!client.user)
            return;
        const activeOrders = await this.prisma.order.findMany({
            where: {
                tenant_id: client.user.tenant_id,
                status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] },
            },
            select: {
                id: true,
                order_number: true,
                customer_name: true,
                status: true,
                total_amount: true,
                created_at: true,
                table: {
                    select: {
                        number: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        order_items: true,
                    },
                },
            },
            orderBy: { created_at: 'asc' },
        });
        client.emit('active_orders', activeOrders);
    }
    handlePing(client) {
        client.emit('pong', { timestamp: new Date().toISOString() });
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_kitchen'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleJoinKitchen", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_kitchen'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleLeaveKitchen", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_active_orders'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleGetActiveOrders", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handlePing", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        namespace: '/orders'
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        websocket_service_1.WebSocketService,
        prisma_service_1.PrismaService])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map