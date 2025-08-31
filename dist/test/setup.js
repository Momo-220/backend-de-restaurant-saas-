"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUtils = exports.setupTestDatabase = void 0;
const client_1 = require("@prisma/client");
jest.setTimeout(30000);
const originalConsole = global.console;
beforeAll(() => {
    global.console = {
        ...originalConsole,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    };
});
afterAll(() => {
    global.console = originalConsole;
});
const setupTestDatabase = async () => {
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.TEST_DATABASE_URL || 'file:./test.db',
            },
        },
    });
    await prisma.$executeRaw `PRAGMA foreign_keys = OFF`;
    const tables = await prisma.$queryRaw `
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'
  `;
    for (const table of tables) {
        await prisma.$executeRawUnsafe(`DELETE FROM ${table.name}`);
    }
    await prisma.$executeRaw `PRAGMA foreign_keys = ON`;
    return prisma;
};
exports.setupTestDatabase = setupTestDatabase;
exports.testUtils = {
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    generateTestId: () => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createTestTenant: () => ({
        name: 'Restaurant Test',
        slug: exports.testUtils.generateTestId(),
        email: 'test@restaurant.com',
        phone: '+221701234567',
        address: 'Dakar, Sénégal',
        is_active: true,
    }),
    createTestUser: (tenantId, role = 'ADMIN') => ({
        email: `user_${exports.testUtils.generateTestId()}@test.com`,
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role,
        tenant_id: tenantId,
        is_active: true,
    }),
};
//# sourceMappingURL=setup.js.map