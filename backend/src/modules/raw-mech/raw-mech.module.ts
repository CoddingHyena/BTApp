import { Module } from '@nestjs/common';
import { RawMechService } from './raw-mech.service';
import { RawMechController } from './raw-mech.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RawMechController],
  providers: [RawMechService],
  exports: [RawMechService],
})
export class RawMechModule {}
