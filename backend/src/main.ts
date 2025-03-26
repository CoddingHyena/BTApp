// // src/main.ts

// import { NestFactory } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
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

// src/main.ts

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:3001', // URL вашего фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('BTapp API')
    .setDescription('API для приложения BTapp для игроков в настольные игры')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();