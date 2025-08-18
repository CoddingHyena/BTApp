

// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CsvDownloadModule } from './modules/csv_download/csv-download.module';
import { PeriodModule } from './modules/period/periods.module';  
import { FactionModule } from './modules/factions/faction.module';
import { MechAvailabilityModule } from './modules/mech-availability/mech-availability.module';
import { MissionModule } from './modules/mission/mission.module';
import { GameModule } from './modules/game/game.module';
import { RawMechModule } from './modules/raw-mech/raw-mech.module';
import { MechModule } from './modules/mech/mech.module';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { CampaignPlayerModule } from './modules/campaign-player/campaign-player.module';
import { CampaignEconomyModule } from './modules/campaign-economy/campaign-economy.module';
import { CampaignProgressModule } from './modules/campaign-progress/campaign-progress.module';
import { BattleReportModule } from './modules/battle-report/battle-report.module';
import { CampaignUnitModule } from './modules/campaign-unit/campaign-unit.module';
import { CampaignPilotModule } from './modules/campaign-pilot/campaign-pilot.module';
import { FormationModule } from './modules/formation/formation.module';
import { MapModule } from './modules/map/map.module';
import { MovementModule } from './modules/movement/movement.module';
import { BattleModule } from './modules/battle/battle.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CsvDownloadModule,
    PeriodModule,
    FactionModule,
    MechAvailabilityModule,
    MissionModule,
    GameModule,
    RawMechModule,
    MechModule,
    CampaignModule,
    CampaignPlayerModule,
    CampaignEconomyModule,
    CampaignProgressModule,
    BattleReportModule,
    CampaignUnitModule,
    CampaignPilotModule,
    FormationModule,
    MapModule,
    MovementModule,
    BattleModule,
    UserModule,
    NotificationModule,
  ],
})
export class AppModule {}