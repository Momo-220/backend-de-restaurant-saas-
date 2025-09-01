import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
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
        'http://localhost:3001',
        'https://backend-de-restaurant-saas-production.up.railway.app',
        /\.railway\.app$/,
        /\.vercel\.app$/
      ],
      credentials: true,
    });
    
    // Prefix API global
    app.setGlobalPrefix('api/v1');
    
    const port = configService.get('PORT') || 3000;
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🔄 SIGTERM received, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🔄 SIGINT received, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

    await app.listen(port, '0.0.0.0');
    
    console.log(`🚀 Application démarrée sur le port ${port}`);
    console.log(`📊 API disponible sur: http://localhost:${port}/api/v1`);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de l\'application:', error);
    process.exit(1);
  }
}

bootstrap();












