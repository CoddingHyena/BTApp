import { Module } from '@nestjs/common';
import { CampaignPlayerController } from './campaign-player.controller';
import { CampaignPlayerService } from './campaign-player.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CampaignPlayerController],
  providers: [CampaignPlayerService],
  exports: [CampaignPlayerService],
})
export class CampaignPlayerModule {} 