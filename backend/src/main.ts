import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // CORS - Permettre Railway et frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://backend-de-restaurant-saas-production.up.railway.app',
      /\.railway\.app$/,
      /\.vercel\.app$/,
      /^http:\/\/(127\.0\.0\.1|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(:[0-9]{2,5})?$/,
    ],
    credentials: true,
  });
  
  // Prefix API global
  app.setGlobalPrefix('api/v1');
  
  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 Application démarrée sur le port ${port}`);
  console.log(`📊 API disponible sur: http://localhost:${port}/api/v1`);
}

bootstrap();












