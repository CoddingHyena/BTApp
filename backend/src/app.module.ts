

// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
// import { ImportModule } from './modules/csv_download/csv-download.module';
import { CsvDownloadModule } from './modules/csv_download/csv-download.module';
import { PeriodModule } from './modules/period/periods.module';  
import { FactionModule } from './modules/factions/faction.module';
import { MechAvailabilityModule } from './modules/mech-availability/mech-availability.module';

@Module({
  imports: [
    PrismaModule,
    CsvDownloadModule,
    PeriodModule,
    FactionModule,
    MechAvailabilityModule,
  ],
})
export class AppModule {}