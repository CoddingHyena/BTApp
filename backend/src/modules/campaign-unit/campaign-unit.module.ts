import { Module } from '@nestjs/common';
import { CampaignUnitController } from './campaign-unit.controller';
import { CampaignUnitService } from './campaign-unit.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CampaignUnitController],
  providers: [CampaignUnitService],
  exports: [CampaignUnitService],
})
export class CampaignUnitModule {} 