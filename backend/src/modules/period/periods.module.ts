import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PeriodController],
  providers: [PeriodService],
  exports: [PeriodService], // Экспортируем сервис для использования в других модулях
})
export class PeriodModule {}