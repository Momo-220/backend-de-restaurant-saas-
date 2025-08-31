// Configuration globale pour tous les tests
import { PrismaClient } from '@prisma/client';

// Configuration globale Jest
jest.setTimeout(30000); // 30 secondes pour les tests longs

// Mock global pour console pendant les tests (optionnel)
const originalConsole = global.console;

beforeAll(() => {
  // Réduire le bruit des logs pendant les tests
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  } as any;
});

afterAll(() => {
  // Restaurer console
  global.console = originalConsole;
});

// Configuration Prisma pour tests
export const setupTestDatabase = async () => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || 'file:./test.db',
      },
    },
  });

  // Nettoyer la base de test avant chaque suite
  await prisma.$executeRaw`PRAGMA foreign_keys = OFF`;
  
  const tables = await prisma.$queryRaw<Array<{ name: string }>>`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'
  `;

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table.name}`);
  }

  await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
  
  return prisma;
};

// Utilitaires de test
export const testUtils = {
  // Attendre un délai
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Générer un ID unique pour les tests
  generateTestId: () => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Créer des données de test cohérentes
  createTestTenant: () => ({
    name: 'Restaurant Test',
    slug: testUtils.generateTestId(),
    email: 'test@restaurant.com',
    phone: '+221701234567',
    address: 'Dakar, Sénégal',
    is_active: true,
  }),
  
  createTestUser: (tenantId: string, role = 'ADMIN') => ({
    email: `user_${testUtils.generateTestId()}@test.com`,
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    role,
    tenant_id: tenantId,
    is_active: true,
  }),
};











