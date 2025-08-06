import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameUploadController } from './game-upload.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GameController, GameUploadController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {} 