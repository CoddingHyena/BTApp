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
import { CampaignPlayerService } from './campaign-player.service';
import { CreateCampaignPlayerDto } from './dto/create-campaign-player.dto';
import { UpdateCampaignPlayerDto } from './dto/update-campaign-player.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { PlayerStatus, PlayerRole } from '@prisma/client';

@Controller('campaign-players')
@UseGuards(AuthGuard)
export class CampaignPlayerController {
  constructor(private readonly campaignPlayerService: CampaignPlayerService) {}

  @Post()
  create(@Body() createCampaignPlayerDto: CreateCampaignPlayerDto) {
    return this.campaignPlayerService.create(createCampaignPlayerDto);
  }

  @Get()
  findAll() {
    return this.campaignPlayerService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignPlayerService.findByCampaign(campaignId);
  }

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.campaignPlayerService.findByPlayer(playerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignPlayerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignPlayerDto: UpdateCampaignPlayerDto) {
    return this.campaignPlayerService.update(id, updateCampaignPlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignPlayerService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: PlayerStatus) {
    return this.campaignPlayerService.updateStatus(id, status);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: PlayerRole) {
    return this.campaignPlayerService.updateRole(id, role);
  }


} 