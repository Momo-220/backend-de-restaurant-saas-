import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        database: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        database: string;
        error: any;
    }>;
    ready(): Promise<{
        status: string;
    }>;
    live(): Promise<{
        status: string;
    }>;
}
