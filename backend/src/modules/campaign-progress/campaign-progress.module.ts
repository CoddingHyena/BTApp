import { Module } from '@nestjs/common';
import { CampaignProgressController } from './campaign-progress.controller';
import { CampaignProgressService } from './campaign-progress.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CampaignProgressController],
  providers: [CampaignProgressService],
  exports: [CampaignProgressService],
})
export class CampaignProgressModule {} 