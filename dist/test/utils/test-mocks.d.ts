export declare const createMockConfigService: (overrides?: Record<string, any>) => {
    get: jest.Mock<any, [key: string, defaultValue?: any], any>;
};
export declare const createMockJwtService: () => {
    sign: jest.Mock<string, [payload: any], any>;
    verify: jest.Mock<any, [token: string], any>;
    decode: jest.Mock<any, [token: string], any>;
};
export declare const createMockPrismaService: () => {
    tenant: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
    };
    user: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
    };
    category: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
    item: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
    table: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
    order: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
        groupBy: jest.Mock<any, any, any>;
    };
    orderItem: {
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        createMany: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
    payment: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
        groupBy: jest.Mock<any, any, any>;
    };
    event: {
        create: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
    };
    $transaction: jest.Mock<any, [fn: any], any>;
    $executeRaw: jest.Mock<any, any, any>;
    $queryRaw: jest.Mock<any, any, any>;
    $executeRawUnsafe: jest.Mock<any, any, any>;
    $queryRawUnsafe: jest.Mock<any, any, any>;
    $connect: jest.Mock<any, any, any>;
    $disconnect: jest.Mock<any, any, any>;
};
export declare const createMockWebSocketService: () => {
    emitToTenant: jest.Mock<any, any, any>;
    emitToUser: jest.Mock<any, any, any>;
    emitToRole: jest.Mock<any, any, any>;
    emitNewOrder: jest.Mock<any, any, any>;
    emitOrderStatusUpdate: jest.Mock<any, any, any>;
    emitOrderReady: jest.Mock<any, any, any>;
    emitPaymentInitiated: jest.Mock<any, any, any>;
    emitPaymentSuccess: jest.Mock<any, any, any>;
    emitPaymentFailed: jest.Mock<any, any, any>;
};
export declare const createMockRedisService: () => {
    get: jest.Mock<any, any, any>;
    set: jest.Mock<any, any, any>;
    del: jest.Mock<any, any, any>;
    exists: jest.Mock<any, any, any>;
    expire: jest.Mock<any, any, any>;
    publish: jest.Mock<any, any, any>;
    subscribe: jest.Mock<any, any, any>;
};
export declare const createMockUsersService: () => {
    create: jest.Mock<any, any, any>;
    findAll: jest.Mock<any, any, any>;
    findOne: jest.Mock<any, any, any>;
    findByEmail: jest.Mock<any, any, any>;
    update: jest.Mock<any, any, any>;
    changePassword: jest.Mock<any, any, any>;
    deactivate: jest.Mock<any, any, any>;
    updateLastLogin: jest.Mock<any, any, any>;
};
export declare const createMockOrdersService: () => {
    create: jest.Mock<any, any, any>;
    createPublicOrder: jest.Mock<any, any, any>;
    findAll: jest.Mock<any, any, any>;
    findOne: jest.Mock<any, any, any>;
    findActiveOrders: jest.Mock<any, any, any>;
    updateStatus: jest.Mock<any, any, any>;
    acceptOrder: jest.Mock<any, any, any>;
    startPreparation: jest.Mock<any, any, any>;
    markReady: jest.Mock<any, any, any>;
    markDelivered: jest.Mock<any, any, any>;
    cancelOrder: jest.Mock<any, any, any>;
    getStats: jest.Mock<any, any, any>;
};
export declare const createMockFilesService: () => {
    uploadFile: jest.Mock<any, any, any>;
    deleteFile: jest.Mock<any, any, any>;
    getFileUrl: jest.Mock<any, any, any>;
};
export declare const createMockQrCodeService: () => {
    generateTableQR: jest.Mock<any, any, any>;
    generateMenuQR: jest.Mock<any, any, any>;
};
export declare const createMockPdfService: () => {
    generateOrderReceipt: jest.Mock<any, any, any>;
};
export declare const createMockMyNitaService: () => {
    initiatePayment: jest.Mock<any, any, any>;
    verifyPayment: jest.Mock<any, any, any>;
    validateWebhook: jest.Mock<any, any, any>;
};
export declare const createMockWaveService: () => {
    initiatePayment: jest.Mock<any, any, any>;
    verifyPayment: jest.Mock<any, any, any>;
    validateWebhook: jest.Mock<any, any, any>;
};
export declare const TestDataFactory: {
    tenant: (overrides?: Partial<any>) => {
        id: string;
        name: string;
        slug: string;
        email: string;
        phone: string;
        address: string;
        logo_url: any;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    };
    user: (tenantId?: string, overrides?: Partial<any>) => {
        id: string;
        email: string;
        password_hash: string;
        first_name: string;
        last_name: string;
        role: string;
        tenant_id: string;
        is_active: boolean;
        last_login: any;
        created_at: Date;
        updated_at: Date;
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    };
    category: (tenantId?: string, overrides?: Partial<any>) => {
        id: string;
        name: string;
        description: string;
        image_url: any;
        sort_order: number;
        is_active: boolean;
        tenant_id: string;
        created_at: Date;
        updated_at: Date;
    };
    item: (categoryId?: string, tenantId?: string, overrides?: Partial<any>) => {
        id: string;
        name: string;
        description: string;
        price: number;
        image_url: any;
        is_available: boolean;
        stock_quantity: number;
        preparation_time: number;
        category_id: string;
        tenant_id: string;
        created_at: Date;
        updated_at: Date;
    };
    order: (tenantId?: string, overrides?: Partial<any>) => {
        id: string;
        order_number: string;
        status: string;
        total_amount: number;
        customer_name: string;
        customer_phone: string;
        customer_email: string;
        table_number: number;
        notes: any;
        tenant_id: string;
        user_id: any;
        created_at: Date;
        updated_at: Date;
    };
    payment: (orderId?: string, tenantId?: string, overrides?: Partial<any>) => {
        id: string;
        order_id: string;
        tenant_id: string;
        method: string;
        amount: number;
        currency: string;
        status: string;
        transaction_id: string;
        provider_reference: any;
        provider_data: {};
        expires_at: Date;
        created_at: Date;
        updated_at: Date;
    };
};
