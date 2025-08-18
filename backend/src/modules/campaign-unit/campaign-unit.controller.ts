import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CampaignUnitService } from './campaign-unit.service';
import { CreateCampaignUnitDto } from './dto/create-campaign-unit.dto';
import { UpdateCampaignUnitDto } from './dto/update-campaign-unit.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { UnitStatus } from '@prisma/client';

@Controller('campaign-units')
@UseGuards(AuthGuard)
export class CampaignUnitController {
  constructor(private readonly campaignUnitService: CampaignUnitService) {}

  @Post()
  create(@Body() createCampaignUnitDto: CreateCampaignUnitDto) {
    return this.campaignUnitService.create(createCampaignUnitDto);
  }

  @Get()
  findAll() {
    return this.campaignUnitService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignUnitService.findByCampaign(campaignId);
  }

  @Get('campaign/:campaignId/faction/:factionId')
  findByFaction(
    @Param('campaignId') campaignId: string,
    @Param('factionId') factionId: string
  ) {
    return this.campaignUnitService.findByFaction(campaignId, parseInt(factionId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignUnitService.findOne(id);
  }

  @Get(':id/statistics')
  getUnitStatistics(@Param('id') id: string) {
    return this.campaignUnitService.getUnitStatistics(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignUnitDto: UpdateCampaignUnitDto) {
    return this.campaignUnitService.update(id, updateCampaignUnitDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: UnitStatus
  ) {
    return this.campaignUnitService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignUnitService.remove(id);
  }
} 