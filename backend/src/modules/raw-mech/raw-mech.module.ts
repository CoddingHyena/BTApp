import { Module } from '@nestjs/common';
import { RawMechService } from './raw-mech.service';
import { RawMechController } from './raw-mech.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [RawMechController],
  providers: [RawMechService],
  exports: [RawMechService],
})
export class RawMechModule {}
