import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MapService } from './map.service';
import { MapTemplateController } from './map-template.controller';
import { CampaignMapController } from './campaign-map.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [MapTemplateController, CampaignMapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}


