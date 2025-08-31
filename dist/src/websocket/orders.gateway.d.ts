import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebSocketService } from './websocket.service';
import { PrismaService } from '../prisma/prisma.service';
interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        tenant_id: string;
        role: string;
        email: string;
    };
}
export declare class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    private webSocketService;
    private prisma;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService, webSocketService: WebSocketService, prisma: PrismaService);
    afterInit(server: Server): void;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinKitchen(client: AuthenticatedSocket): void;
    handleLeaveKitchen(client: AuthenticatedSocket): void;
    handleGetActiveOrders(client: AuthenticatedSocket): Promise<void>;
    handlePing(client: AuthenticatedSocket): void;
}
export {};
