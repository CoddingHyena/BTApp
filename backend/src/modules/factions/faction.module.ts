import { Module } from '@nestjs/common';
import { FactionService } from './faction.service';
import { FactionController } from './faction.controller';
import { FactionUploadController } from './faction-upload.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FactionController, FactionUploadController],
  providers: [FactionService],
  exports: [FactionService], // Экспортируем сервис для использования в других модулях
})
export class FactionModule {}