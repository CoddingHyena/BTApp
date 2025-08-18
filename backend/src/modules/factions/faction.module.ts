import { Module } from '@nestjs/common';
import { FactionService } from './faction.service';
import { FactionController } from './faction.controller';
import { FactionUploadController } from './faction-upload.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [FactionController, FactionUploadController],
  providers: [FactionService],
  exports: [FactionService], // Экспортируем сервис для использования в других модулях
})
export class FactionModule {}