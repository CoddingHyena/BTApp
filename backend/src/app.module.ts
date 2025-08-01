

// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
// import { ImportModule } from './modules/csv_download/csv-download.module';
import { CsvDownloadModule } from './modules/csv_download/csv-download.module';
import { PeriodModule } from './modules/period/periods.module';  
import { FactionModule } from './modules/factions/faction.module';
import { MechAvailabilityModule } from './modules/mech-availability/mech-availability.module';
import { MissionModule } from './modules/mission/mission.module';
import { GameModule } from './modules/game/game.module';
import { AuthModule } from './auth/auth.module';

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
  ],
})
export class AppModule {}