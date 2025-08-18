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
import { BattleReportService } from './battle-report.service';
import { CreateBattleReportDto } from './dto/create-battle-report.dto';
import { UpdateBattleReportDto } from './dto/update-battle-report.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { BattleResult } from '@prisma/client';

@Controller('battle-reports')
@UseGuards(AuthGuard)
export class BattleReportController {
  constructor(private readonly battleReportService: BattleReportService) {}

  @Post()
  create(@Body() createBattleReportDto: CreateBattleReportDto) {
    return this.battleReportService.create(createBattleReportDto);
  }

  @Get()
  findAll() {
    return this.battleReportService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.battleReportService.findByCampaign(campaignId);
  }

  @Get('campaign/:campaignId/player/:playerId')
  findByPlayer(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.battleReportService.findByPlayer(campaignId, playerId);
  }

  @Get('campaign/:campaignId/result/:result')
  findByResult(
    @Param('campaignId') campaignId: string,
    @Param('result') result: BattleResult
  ) {
    return this.battleReportService.findByResult(campaignId, result);
  }

  @Get('campaign/:campaignId/date-range')
  findByDateRange(
    @Param('campaignId') campaignId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.battleReportService.findByDateRange(campaignId, startDate, endDate);
  }

  @Get('campaign/:campaignId/player/:playerId/statistics')
  getBattleStatistics(
    @Param('campaignId') campaignId: string,
    @Param('playerId') playerId: string
  ) {
    return this.battleReportService.getBattleStatistics(campaignId, playerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.battleReportService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBattleReportDto: UpdateBattleReportDto) {
    return this.battleReportService.update(id, updateBattleReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.battleReportService.remove(id);
  }

  @Post(':id/verify')
  verifyReport(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string
  ) {
    return this.battleReportService.verifyReport(id, verifiedBy);
  }
} 