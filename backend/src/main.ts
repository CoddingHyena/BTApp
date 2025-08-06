import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  //директории для хранения изображений, если их нет
  const uploadsDir = join(__dirname, '..', 'public', 'uploads');
  const periodsImagesDir = join(uploadsDir, 'periods');
  const periodsBannersDir = join(uploadsDir, 'periods', 'banners');
  const factionsImagesDir = join(uploadsDir, 'factions');
  const factionsLogosDir = join(uploadsDir, 'factions', 'logos');
  const factionsBannersDir = join(uploadsDir, 'factions', 'banners');
  const missionsImagesDir = join(uploadsDir, 'missions');
  const gamesIconsDir = join(uploadsDir, 'games', 'icons');
  const gamesBannersDir = join(uploadsDir, 'games', 'banners');
  
   [uploadsDir, periodsImagesDir, periodsBannersDir, factionsImagesDir, factionsLogosDir, factionsBannersDir, missionsImagesDir, gamesIconsDir, gamesBannersDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Настройка статических файлов - добавляем возможность доступа к публичным файлам
  const publicPath = join(process.cwd(), 'public');
  const uploadsPath = join(publicPath, 'uploads');
  console.log('Static assets path:', publicPath);
  console.log('Static assets exists:', fs.existsSync(publicPath));
  console.log('Uploads path:', uploadsPath);
  console.log('Uploads exists:', fs.existsSync(uploadsPath));
  
  // Настройка статических файлов - раздаем всю папку public
  app.useStaticAssets(publicPath);
  
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
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();