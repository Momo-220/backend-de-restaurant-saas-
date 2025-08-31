"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const common_1 = require("@nestjs/common");
let WebSocketService = class WebSocketService {
    setServer(server) {
        this.server = server;
    }
    emitToTenant(tenantId, event, data) {
        if (this.server) {
            this.server.to(`tenant_${tenantId}`).emit(event, data);
        }
    }
    emitToTenantRole(tenantId, role, event, data) {
        if (this.server) {
            this.server.to(`tenant_${tenantId}_${role}`).emit(event, data);
        }
    }
    emitToUser(userId, event, data) {
        if (this.server) {
            this.server.to(`user_${userId}`).emit(event, data);
        }
    }
    emitNewOrder(tenantId, orderData) {
        this.emitToTenantRole(tenantId, 'kitchen', 'new_order', {
            type: 'NEW_ORDER',
            order: orderData,
            timestamp: new Date().toISOString(),
        });
        this.emitToTenantRole(tenantId, 'MANAGER', 'new_order', {
            type: 'NEW_ORDER',
            order: orderData,
            timestamp: new Date().toISOString(),
        });
        this.emitToTenantRole(tenantId, 'ADMIN', 'new_order', {
            type: 'NEW_ORDER',
            order: orderData,
            timestamp: new Date().toISOString(),
        });
    }
    emitOrderStatusUpdate(tenantId, orderData) {
        this.emitToTenant(tenantId, 'order_status_update', {
            type: 'ORDER_STATUS_UPDATE',
            order: orderData,
            timestamp: new Date().toISOString(),
        });
    }
    emitOrderReady(tenantId, orderData) {
        this.emitToTenant(tenantId, 'order_ready', {
            type: 'ORDER_READY',
            order: orderData,
            timestamp: new Date().toISOString(),
        });
    }
    emitStatsUpdate(tenantId, stats) {
        this.emitToTenantRole(tenantId, 'ADMIN', 'stats_update', {
            type: 'STATS_UPDATE',
            stats,
            timestamp: new Date().toISOString(),
        });
        this.emitToTenantRole(tenantId, 'MANAGER', 'stats_update', {
            type: 'STATS_UPDATE',
            stats,
            timestamp: new Date().toISOString(),
        });
    }
    emitPaymentInitiated(tenantId, paymentData) {
        this.emitToTenant(tenantId, 'payment_initiated', {
            type: 'PAYMENT_INITIATED',
            payment: paymentData,
            timestamp: new Date().toISOString(),
        });
    }
    emitPaymentSuccess(tenantId, paymentData) {
        this.emitToTenant(tenantId, 'payment_success', {
            type: 'PAYMENT_SUCCESS',
            payment: paymentData,
            timestamp: new Date().toISOString(),
        });
    }
    emitPaymentFailed(tenantId, paymentData) {
        this.emitToTenant(tenantId, 'payment_failed', {
            type: 'PAYMENT_FAILED',
            payment: paymentData,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, common_1.Injectable)()
], WebSocketService);
//# sourceMappingURL=websocket.service.js.map