import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('map/campaign')
@UseGuards(AuthGuard)
export class CampaignMapController {
  constructor(private readonly mapService: MapService) {}

  @Post(':campaignId/bind/:templateId')
  bind(@Param('campaignId') campaignId: string, @Param('templateId') templateId: string) {
    return this.mapService.bindCampaignMap(campaignId, templateId);
  }

  @Get(':campaignId')
  get(@Param('campaignId') campaignId: string) {
    return this.mapService.getCampaignMap(campaignId);
  }
}


