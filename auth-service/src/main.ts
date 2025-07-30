import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Загружаем .env файл
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Настройка CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Отладочная информация
  console.log('🔍 Переменные окружения:');
  console.log('PORT из env:', process.env.PORT);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Auth Service запущен на порту: ${port}`);
  console.log(`📡 API доступен по адресу: http://localhost:${port}`);
}
bootstrap();
