

// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
// import { ImportModule } from './modules/csv_download/csv-download.module';
import { CsvDownloadModule } from './modules/csv_download/csv-download.module';

@Module({
  imports: [
    PrismaModule,
    CsvDownloadModule,
  ],
})
export class AppModule {}