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
import { CampaignProgressService } from './campaign-progress.service';
import { CreateCampaignProgressDto } from './dto/create-campaign-progress.dto';
import { UpdateCampaignProgressDto } from './dto/update-campaign-progress.dto';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('campaign-progress')
@UseGuards(AuthGuard)
export class CampaignProgressController {
  constructor(private readonly campaignProgressService: CampaignProgressService) {}

  @Post()
  create(@Body() createCampaignProgressDto: CreateCampaignProgressDto) {
    return this.campaignProgressService.create(createCampaignProgressDto);
  }

  @Get()
  findAll() {
    return this.campaignProgressService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignProgressService.findByCampaign(campaignId);
  }

  @Get('campaign/:campaignId/player/:playerId')
  findByPlayer(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.campaignProgressService.findByPlayer(campaignId, playerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignProgressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignProgressDto: UpdateCampaignProgressDto) {
    return this.campaignProgressService.update(id, updateCampaignProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignProgressService.remove(id);
  }

  @Post('campaign/:campaignId/player/:playerId/battle-won')
  addBattleWon(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.campaignProgressService.addBattleWon(campaignId, playerId);
  }

  @Post('campaign/:campaignId/player/:playerId/battle-lost')
  addBattleLost(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.campaignProgressService.addBattleLost(campaignId, playerId);
  }

  @Post('campaign/:campaignId/player/:playerId/battle-drawn')
  addBattleDrawn(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.campaignProgressService.addBattleDrawn(campaignId, playerId);
  }

  @Patch('campaign/:campaignId/player/:playerId/rating')
  updateRating(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string,
    @Body('rating') rating: number
  ) {
    return this.campaignProgressService.updateRating(campaignId, playerId, rating);
  }

  @Post('campaign/:campaignId/player/:playerId/achievement')
  addAchievement(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string,
    @Body() achievement: any
  ) {
    return this.campaignProgressService.addAchievement(campaignId, playerId, achievement);
  }
} 