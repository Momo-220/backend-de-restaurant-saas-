import { PrismaClient } from '@prisma/client';
export declare const setupTestDatabase: () => Promise<PrismaClient<{
    datasources: {
        db: {
            url: string;
        };
    };
}, never, import("@prisma/client/runtime/library").DefaultArgs>>;
export declare const testUtils: {
    wait: (ms: number) => Promise<unknown>;
    generateTestId: () => string;
    createTestTenant: () => {
        name: string;
        slug: string;
        email: string;
        phone: string;
        address: string;
        is_active: boolean;
    };
    createTestUser: (tenantId: string, role?: string) => {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        role: string;
        tenant_id: string;
        is_active: boolean;
    };
};
