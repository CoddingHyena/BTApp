import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BattleService } from './battle.service';
import { AuthGuard } from '../../auth/auth.guard';
import { BattleSideRole, BattleStatus } from '@prisma/client';

@Controller('battles')
@UseGuards(AuthGuard)
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post()
  create(@Body() body: { campaignId: string; nodeId: string; missionId: string; notes?: string; rules?: any }) {
    return this.battleService.createBattle(body);
  }

  @Get('campaign/:campaignId')
  listByCampaign(@Param('campaignId') campaignId: string) {
    return this.battleService.listByCampaign(campaignId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.battleService.getBattle(id);
  }

  @Post(':id/sides')
  addSide(@Param('id') id: string, @Body() body: { factionId: number; role: BattleSideRole }) {
    return this.battleService.addSide(id, body.factionId, body.role);
  }

  @Post(':id/formations')
  addFormation(@Param('id') id: string, @Body() body: { sideId: string; formationId: string }) {
    return this.battleService.addFormation(id, body.sideId, body.formationId);
  }

  @Patch('formations/:battleFormationId/commit')
  setCommitted(@Param('battleFormationId') battleFormationId: string, @Body() body: { campaignUnitIds: string[] }) {
    return this.battleService.setCommittedUnits(battleFormationId, body.campaignUnitIds);
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() body: { status: BattleStatus }) {
    return this.battleService.setStatus(id, body.status);
  }

  @Patch(':id/link-report')
  linkReport(@Param('id') id: string, @Body() body: { reportId: string }) {
    return this.battleService.linkReport(id, body.reportId);
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.battleService.resolveBattle(id);
  }

  @Post(':id/apply-consequences')
  applyConsequences(@Param('id') id: string, @Body() body: { updates: Array<{ campaignUnitId: string; status?: any; damageType?: any; repairCost?: number; repairTime?: number; isRepaired?: boolean }> }) {
    return this.battleService.applyConsequences(id, body.updates);
  }
}


