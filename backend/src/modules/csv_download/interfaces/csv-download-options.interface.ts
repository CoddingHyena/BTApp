// // src/modules/import/interfaces/import-options.interface.ts
// export interface ImportOptions {
//     filePath: string;
//     skipDuplicates?: boolean;
//     updateExisting?: boolean;
//   }

// src/modules/csv_download/interfaces/csv-download-options.interface.ts

export interface CsvDownloadOptions {
  filePath: string;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}