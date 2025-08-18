import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [BattleService],
  controllers: [BattleController],
  exports: [BattleService],
})
export class BattleModule {}


