import { Module } from '@nestjs/common';
import { MechService } from './mech.service';
import { MechController } from './mech.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [MechController],
  providers: [MechService],
  exports: [MechService],
})
export class MechModule {}
