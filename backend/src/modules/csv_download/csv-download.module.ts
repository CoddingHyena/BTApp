// // src/modules/import/import.module.ts
// import { Module } from '@nestjs/common';
// import { MechCsvImportController } from './csv-download.controller';
// import { MechCsvImportService } from './csv-download.service';
// import { PrismaModule } from '../../prisma/prisma.module';


// @Module({
//   imports: [PrismaModule],
//   controllers: [MechCsvImportController],
//   providers: [MechCsvImportService],
//   exports: [MechCsvImportService],
// })
// export class ImportModule {}

// import { Module } from '@nestjs/common';
// import { CsvDownloadController } from './csv-download.controller';
// import { CsvDownloadService } from './csv-download.service';
// import { PrismaModule } from '../../prisma/prisma.module';

// @Module({
//   imports: [PrismaModule],
//   controllers: [CsvDownloadController],
//   providers: [CsvDownloadService],
//   exports: [CsvDownloadService]
// })
// export class CsvDownloadModule {}

// src/modules/csv_download/csv-download.module.ts
import { Module } from '@nestjs/common';
import { CsvDownloadController } from './csv-download.controller';
import { CsvDownloadService } from './csv-download.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CsvDownloadController],
  providers: [CsvDownloadService],
  exports: [CsvDownloadService]
})
export class CsvDownloadModule {}