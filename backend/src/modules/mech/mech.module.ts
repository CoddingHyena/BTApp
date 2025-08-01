import { Module } from '@nestjs/common';
import { MechService } from './mech.service';
import { MechController } from './mech.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MechController],
  providers: [MechService],
  exports: [MechService],
})
export class MechModule {}
