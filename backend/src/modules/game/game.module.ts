import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameUploadController } from './game-upload.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [GameController, GameUploadController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {} 