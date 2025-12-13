import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionGeneratorService } from './mission-generator.service';
import { MissionController } from './mission.controller';
import { MissionUploadController } from './mission-upload.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [MissionController, MissionUploadController],
  providers: [MissionService, MissionGeneratorService],
  exports: [MissionService, MissionGeneratorService], // Экспорт для возможного использования в других модулях
})
export class MissionModule {}