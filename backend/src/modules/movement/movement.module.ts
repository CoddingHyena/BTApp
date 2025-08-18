import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MovementService } from './movement.service';
import { MovementController } from './movement.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [MovementController],
  providers: [MovementService],
})
export class MovementModule {}


