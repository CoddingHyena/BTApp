import { Module } from '@nestjs/common';
import { CampaignEconomyController } from './campaign-economy.controller';
import { CampaignEconomyService } from './campaign-economy.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CampaignEconomyController],
  providers: [CampaignEconomyService],
  exports: [CampaignEconomyService],
})
export class CampaignEconomyModule {} 