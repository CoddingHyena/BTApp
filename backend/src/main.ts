// import { NestFactory } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   // Настройка CORS
//   app.enableCors({
//     origin: 'http://localhost:3001', // URL вашего фронтенда
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });
  
//   // Настройка Swagger
//   const config = new DocumentBuilder()
//     .setTitle('BTapp API')
//     .setDescription('API для приложения BTapp для игроков в настольные игры')
//     .setVersion('1.0')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
  
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  // Изменяем тип приложения на NestExpressApplication для доступа к express-специфичным методам
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Настройка CORS (оставляем как есть)
  app.enableCors({
    origin: 'http://localhost:3001', // URL вашего фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Создаем директории для хранения изображений, если их нет
  const uploadsDir = join(__dirname, '..', 'public', 'uploads');
  const periodsImagesDir = join(uploadsDir, 'periods');
  const periodsBannersDir = join(uploadsDir, 'periods', 'banners');
  const factionsImagesDir = join(uploadsDir, 'factions');
  const factionsBannersDir = join(uploadsDir, 'factions', 'logos');
  
  // Убедимся, что директории существуют
  [uploadsDir, periodsImagesDir, periodsBannersDir, factionsImagesDir, factionsBannersDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Настройка статических файлов - добавляем возможность доступа к публичным файлам
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Настройка Swagger (оставляем как есть)
  const config = new DocumentBuilder()
    .setTitle('BTapp API')
    .setDescription('API для приложения BTapp для игроков в настольные игры')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Запуск приложения (оставляем порт как есть)
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();