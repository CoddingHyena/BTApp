import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AssignStrategistDto } from './dto/assign-strategist.dto';
import { UpdatePlayerFactionDto } from './dto/update-player-faction.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { CampaignType } from '@prisma/client';

@Controller('campaigns')
@UseGuards(AuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    return this.campaignService.create(createCampaignDto, req.user?.id);
  }

  @Get()
  findAll() {
    return this.campaignService.findAll();
  }

  @Get('type/:type')
  findByType(@Param('type') type: CampaignType) {
    return this.campaignService.findByType(type);
  }

  @Get('game/:gameId')
  findByGame(@Param('gameId') gameId: string) {
    return this.campaignService.findByGame(gameId);
  }

  @Get('hierarchy/:id')
  getHierarchy(@Param('id') id: string) {
    return this.campaignService.getHierarchy(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }

  // Новые эндпоинты для управления стратегами
  @Get(':id/strategists')
  getStrategists(@Param('id') id: string) {
    return this.campaignService.getStrategists(id);
  }

  @Post(':id/strategists')
  assignStrategist(
    @Param('id') id: string,
    @Body() assignStrategistDto: AssignStrategistDto,
    @Request() req
  ) {
    return this.campaignService.assignStrategist(id, assignStrategistDto, req.user?.id);
  }

  @Delete(':id/strategists/:factionId')
  removeStrategist(
    @Param('id') id: string,
    @Param('factionId') factionId: string,
    @Request() req
  ) {
    return this.campaignService.removeStrategist(id, parseInt(factionId), req.user?.id);
  }

  @Get(':id/available-users')
  getAvailableUsers(@Param('id') id: string) {
    return this.campaignService.getAvailableUsers(id);
  }

  @Get(':id/players')
  getPlayers(@Param('id') id: string) {
    return this.campaignService.getPlayers(id);
  }

  @Post(':id/invite')
  invitePlayer(
    @Param('id') id: string,
    @Body() invitePlayerDto: { userId: string },
    @Request() req
  ) {
    return this.campaignService.invitePlayer(id, invitePlayerDto.userId, req.user?.id);
  }

  @Get(':id/recent-invitations/:userId')
  getRecentInvitations(
    @Param('id') id: string,
    @Param('userId') userId: string
  ) {
    return this.campaignService.getRecentInvitations(id, userId);
  }

  @Put(':campaignId/players/:playerId/faction')
  updatePlayerFaction(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string,
    @Body() updatePlayerFactionDto: UpdatePlayerFactionDto,
    @Request() req
  ) {
    return this.campaignService.updatePlayerFaction(
      campaignId, 
      playerId, 
      updatePlayerFactionDto.factionId ?? null, 
      req.user?.id
    );
  }

  @Get(':id/factions')
  getCampaignFactions(@Param('id') id: string) {
    return this.campaignService.getCampaignFactions(id);
  }
} 