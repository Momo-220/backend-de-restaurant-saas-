"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:3001',
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 Application démarrée sur le port ${port}`);
    console.log(`📊 API disponible sur: http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map