import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { STATIC_PATHS } from './utils/static-paths.util';

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3003', 'http://localhost:3003', 'http://localhost:3002', 'http://127.0.0.1:3002'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Создание директорий для статических файлов
  const requiredDirs = [
    STATIC_PATHS.UPLOADS,
    STATIC_PATHS.PERIODS.IMAGES,
    STATIC_PATHS.PERIODS.BANNERS,
    STATIC_PATHS.FACTIONS.LOGOS,
    STATIC_PATHS.FACTIONS.BANNERS,
    STATIC_PATHS.GAMES.ICONS,
    STATIC_PATHS.GAMES.BANNERS,
    STATIC_PATHS.MISSIONS.IMAGES,
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Создана директория: ${dir}`);
    }
  });
  
  // Настройка статических файлов
  console.log('📁 Static assets path:', STATIC_PATHS.PUBLIC);
  console.log('📁 Static assets exists:', fs.existsSync(STATIC_PATHS.PUBLIC));
  console.log('📁 Uploads path:', STATIC_PATHS.UPLOADS);
  console.log('📁 Uploads exists:', fs.existsSync(STATIC_PATHS.UPLOADS));
  
  // Настройка статических файлов - раздаем всю папку public
  app.useStaticAssets(STATIC_PATHS.PUBLIC);
  
  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('BTapp API')
    .setDescription('API для приложения BTapp для игроков в настольные игры')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Запуск приложения
  await app.listen(3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(`📸 Static files available at: ${await app.getUrl()}/uploads/`);
}
bootstrap();