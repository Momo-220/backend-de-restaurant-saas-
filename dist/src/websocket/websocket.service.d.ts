import { Server } from 'socket.io';
export declare class WebSocketService {
    private server;
    setServer(server: Server): void;
    emitToTenant(tenantId: string, event: string, data: any): void;
    emitToTenantRole(tenantId: string, role: string, event: string, data: any): void;
    emitToUser(userId: string, event: string, data: any): void;
    emitNewOrder(tenantId: string, orderData: any): void;
    emitOrderStatusUpdate(tenantId: string, orderData: any): void;
    emitOrderReady(tenantId: string, orderData: any): void;
    emitStatsUpdate(tenantId: string, stats: any): void;
    emitPaymentInitiated(tenantId: string, paymentData: any): void;
    emitPaymentSuccess(tenantId: string, paymentData: any): void;
    emitPaymentFailed(tenantId: string, paymentData: any): void;
}
