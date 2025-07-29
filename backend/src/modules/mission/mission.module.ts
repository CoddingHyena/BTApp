import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { MissionUploadController } from './mission-upload.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MissionController, MissionUploadController],
  providers: [MissionService],
  exports: [MissionService], // Экспорт для возможного использования в других модулях
})
export class MissionModule {}