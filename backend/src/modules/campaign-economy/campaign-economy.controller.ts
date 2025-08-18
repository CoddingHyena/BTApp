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
import { CampaignEconomyService } from './campaign-economy.service';
import { CreateCampaignEconomyDto } from './dto/create-campaign-economy.dto';
import { UpdateCampaignEconomyDto } from './dto/update-campaign-economy.dto';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('campaign-economy')
@UseGuards(AuthGuard)
export class CampaignEconomyController {
  constructor(private readonly campaignEconomyService: CampaignEconomyService) {}

  @Post()
  create(@Body() createCampaignEconomyDto: CreateCampaignEconomyDto) {
    return this.campaignEconomyService.create(createCampaignEconomyDto);
  }

  @Get()
  findAll() {
    return this.campaignEconomyService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignEconomyService.findByCampaign(campaignId);
  }

  @Get('campaign/:campaignId/player/:playerId')
  findByPlayer(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.campaignEconomyService.findByPlayer(campaignId, playerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignEconomyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignEconomyDto: UpdateCampaignEconomyDto) {
    return this.campaignEconomyService.update(id, updateCampaignEconomyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignEconomyService.remove(id);
  }

  @Post('campaign/:campaignId/player/:playerId/add-funds')
  addFunds(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string,
    @Body('amount') amount: number
  ) {
    return this.campaignEconomyService.addFunds(campaignId, playerId, amount);
  }

  @Post('campaign/:campaignId/player/:playerId/deduct-funds')
  deductFunds(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string,
    @Body('amount') amount: number
  ) {
    return this.campaignEconomyService.deductFunds(campaignId, playerId, amount);
  }

  @Post('campaign/:campaignId/player/:playerId/transaction')
  addTransaction(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string,
    @Body() transaction: any
  ) {
    return this.campaignEconomyService.addTransaction(campaignId, playerId, transaction);
  }
} 