import { Module } from '@nestjs/common';
import { CampaignPilotService } from './campaign-pilot.service';
import { CampaignPilotController } from './campaign-pilot.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [CampaignPilotController],
  providers: [CampaignPilotService],
  exports: [CampaignPilotService],
})
export class CampaignPilotModule {}
