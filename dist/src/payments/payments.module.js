"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const payments_controller_1 = require("./payments.controller");
const payments_service_1 = require("./payments.service");
const mynita_service_1 = require("./providers/mynita.service");
const wave_service_1 = require("./providers/wave.service");
const webhooks_controller_1 = require("./webhooks.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const orders_module_1 = require("../orders/orders.module");
const websocket_module_1 = require("../websocket/websocket.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            orders_module_1.OrdersModule,
            websocket_module_1.WebsocketModule,
        ],
        controllers: [
            payments_controller_1.PaymentsController,
            webhooks_controller_1.WebhooksController,
        ],
        providers: [
            payments_service_1.PaymentsService,
            mynita_service_1.MyNitaService,
            wave_service_1.WaveService,
        ],
        exports: [
            payments_service_1.PaymentsService,
            mynita_service_1.MyNitaService,
            wave_service_1.WaveService,
        ],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map