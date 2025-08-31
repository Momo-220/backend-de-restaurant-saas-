import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface RequestWithTenant extends Request {
    tenant?: {
        id: string;
        slug: string;
        name: string;
    };
    user?: {
        id: string;
        tenant_id: string;
        email: string;
        role: string;
    };
}
export declare class TenantMiddleware implements NestMiddleware {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    use(req: RequestWithTenant, res: Response, next: NextFunction): Promise<void>;
    private extractTenantId;
    private extractTenantFromJWT;
}
