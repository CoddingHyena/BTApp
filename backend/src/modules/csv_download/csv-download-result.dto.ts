// src/modules/import/dto/import-result.dto.ts
export class ImportResultDto {
    success: boolean;
    totalRecords: number;
    importedRecords: number;
    skippedRecords: number;
    errors: string[];
    elapsedTimeMs: number;
  }