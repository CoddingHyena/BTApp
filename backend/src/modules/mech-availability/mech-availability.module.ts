import { Module } from '@nestjs/common';
import { MechAvailabilityService } from './mech-availability.service';
import { MechAvailabilityController } from './mech-availability.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MechAvailabilityController],
  providers: [MechAvailabilityService],
  exports: [MechAvailabilityService], // Экспортируем сервис для использования в других модулях
})
export class MechAvailabilityModule {}