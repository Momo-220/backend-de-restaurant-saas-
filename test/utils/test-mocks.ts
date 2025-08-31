// Mocks utilitaires pour les tests
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/prisma/prisma.service';

// Mock ConfigService
export const createMockConfigService = (overrides: Record<string, any> = {}) => ({
  get: jest.fn((key: string, defaultValue?: any) => {
    const config = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '24h',
      DATABASE_URL: 'file:./test.db',
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      APP_URL: 'http://localhost:3000',
      FRONTEND_URL: 'http://localhost:3001',
      AWS_REGION: 'us-west-2',
      AWS_S3_BUCKET: 'test-bucket',
      WAVE_API_URL: 'https://api.wave.com/test',
      WAVE_MERCHANT_ID: 'test-wave-merchant',
      MYNITA_API_URL: 'https://api.mynita.com/test',
      MYNITA_MERCHANT_ID: 'test-mynita-merchant',
      ...overrides,
    };
    return config[key] || defaultValue;
  }),
});

// Mock JwtService
export const createMockJwtService = () => ({
  sign: jest.fn((payload: any) => `mock-jwt-token-${JSON.stringify(payload)}`),
  verify: jest.fn((token: string) => {
    if (token.startsWith('mock-jwt-token-')) {
      const payload = token.replace('mock-jwt-token-', '');
      return JSON.parse(payload);
    }
    throw new Error('Invalid token');
  }),
  decode: jest.fn((token: string) => {
    if (token.startsWith('mock-jwt-token-')) {
      const payload = token.replace('mock-jwt-token-', '');
      return JSON.parse(payload);
    }
    return null;
  }),
});

// Mock PrismaService avec méthodes principales
export const createMockPrismaService = () => {
  const mockPrisma = {
    // Tenant operations
    tenant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    
    // User operations
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    
    // Category operations
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Item operations
    item: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Table operations
    table: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Order operations
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    
    // OrderItem operations
    orderItem: {
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Payment operations
    payment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    
    // Event operations
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    
    // Transaction operations
    $transaction: jest.fn((fn) => fn(mockPrisma)),
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
    $executeRawUnsafe: jest.fn(),
    $queryRawUnsafe: jest.fn(),
    
    // Connection
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  
  return mockPrisma;
};

// Mock WebSocket Service
export const createMockWebSocketService = () => ({
  emitToTenant: jest.fn(),
  emitToUser: jest.fn(),
  emitToRole: jest.fn(),
  emitNewOrder: jest.fn(),
  emitOrderStatusUpdate: jest.fn(),
  emitOrderReady: jest.fn(),
  emitPaymentInitiated: jest.fn(),
  emitPaymentSuccess: jest.fn(),
  emitPaymentFailed: jest.fn(),
});

// Mock Redis Service
export const createMockRedisService = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
});

// Mock Users Service
export const createMockUsersService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  changePassword: jest.fn(),
  deactivate: jest.fn(),
  updateLastLogin: jest.fn(),
});

// Mock Orders Service
export const createMockOrdersService = () => ({
  create: jest.fn(),
  createPublicOrder: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findActiveOrders: jest.fn(),
  updateStatus: jest.fn(),
  acceptOrder: jest.fn(),
  startPreparation: jest.fn(),
  markReady: jest.fn(),
  markDelivered: jest.fn(),
  cancelOrder: jest.fn(),
  getStats: jest.fn(),
});

// Mock File Services
export const createMockFilesService = () => ({
  uploadFile: jest.fn().mockResolvedValue({ url: 'https://test-bucket.s3.amazonaws.com/test-file.jpg' }),
  deleteFile: jest.fn().mockResolvedValue(true),
  getFileUrl: jest.fn().mockReturnValue('https://test-bucket.s3.amazonaws.com/test-file.jpg'),
});

export const createMockQrCodeService = () => ({
  generateTableQR: jest.fn().mockResolvedValue({ filename: 'table-qr-123.png', url: 'https://test.com/qr.png' }),
  generateMenuQR: jest.fn().mockResolvedValue({ filename: 'menu-qr-123.png', url: 'https://test.com/qr.png' }),
});

export const createMockPdfService = () => ({
  generateOrderReceipt: jest.fn().mockResolvedValue({ filename: 'receipt-123.pdf', url: 'https://test.com/receipt.pdf' }),
});

// Mock Payment Providers
export const createMockMyNitaService = () => ({
  initiatePayment: jest.fn().mockResolvedValue({
    success: true,
    payment_url: 'https://mynita.com/pay/test-123',
    transaction_id: 'mynita-tx-123',
  }),
  verifyPayment: jest.fn().mockResolvedValue({ status: 'SUCCESS', amount: 10000 }),
  validateWebhook: jest.fn().mockReturnValue(true),
});

export const createMockWaveService = () => ({
  initiatePayment: jest.fn().mockResolvedValue({
    success: true,
    payment_url: 'https://wave.com/pay/test-123',
    transaction_id: 'wave-tx-123',
  }),
  verifyPayment: jest.fn().mockResolvedValue({ status: 'SUCCESS', amount: 10000 }),
  validateWebhook: jest.fn().mockReturnValue(true),
});

// Factory pour créer des données de test
export const TestDataFactory = {
  tenant: (overrides: Partial<any> = {}) => ({
    id: 'tenant-123',
    name: 'Restaurant Test',
    slug: 'restaurant-test',
    email: 'test@restaurant.com',
    phone: '+221701234567',
    address: 'Dakar, Sénégal',
    logo_url: null,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }),
  
  user: (tenantId: string = 'tenant-123', overrides: Partial<any> = {}) => ({
    id: 'user-123',
    email: 'user@test.com',
    password_hash: 'hashed-password',
    first_name: 'Test',
    last_name: 'User',
    role: 'ADMIN',
    tenant_id: tenantId,
    is_active: true,
    last_login: null,
    created_at: new Date(),
    updated_at: new Date(),
    tenant: {
      id: tenantId,
      name: 'Restaurant Test',
      slug: 'restaurant-test',
    },
    ...overrides,
  }),
  
  category: (tenantId: string = 'tenant-123', overrides: Partial<any> = {}) => ({
    id: 'category-123',
    name: 'Plats Principaux',
    description: 'Nos délicieux plats principaux',
    image_url: null,
    sort_order: 1,
    is_active: true,
    tenant_id: tenantId,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }),
  
  item: (categoryId: string = 'category-123', tenantId: string = 'tenant-123', overrides: Partial<any> = {}) => ({
    id: 'item-123',
    name: 'Thieboudienne',
    description: 'Riz au poisson sénégalais',
    price: 2500,
    image_url: null,
    is_available: true,
    stock_quantity: 100,
    preparation_time: 20,
    category_id: categoryId,
    tenant_id: tenantId,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }),
  
  order: (tenantId: string = 'tenant-123', overrides: Partial<any> = {}) => ({
    id: 'order-123',
    order_number: 'ORD-2024-001',
    status: 'PENDING',
    total_amount: 5000,
    customer_name: 'Client Test',
    customer_phone: '+221701234567',
    customer_email: 'client@test.com',
    table_number: 5,
    notes: null,
    tenant_id: tenantId,
    user_id: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }),
  
  payment: (orderId: string = 'order-123', tenantId: string = 'tenant-123', overrides: Partial<any> = {}) => ({
    id: 'payment-123',
    order_id: orderId,
    tenant_id: tenantId,
    method: 'MYNITA',
    amount: 5000,
    currency: 'XOF',
    status: 'PENDING',
    transaction_id: 'tx-123',
    provider_reference: null,
    provider_data: {},
    expires_at: new Date(Date.now() + 30 * 60 * 1000),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }),
};
