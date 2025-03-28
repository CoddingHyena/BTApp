
// src/modules/csv_download/csv-download.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RawMechCsvRecord } from './interfaces/raw-mech-csv-record.interface';
import { CsvDownloadOptions } from './interfaces/csv-download-options.interface';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { CsvParserUtil } from './utils/csv-parser.util';

// Интерфейс для совместимости с фронтендом
export interface ImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  skippedRecords: number;
  errors: string[];
  elapsedTimeMs: number;
}

// Новые DTO для внутреннего использования
export interface CsvDownloadResultDto extends ImportResult {
  status?: string;
  recordCount?: number;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  downloadUrl?: string;
  metadata?: any;
}

export interface CsvDownloadRequestDto {
  applyDefaults?: boolean;
  mechType?: string;
  technology?: string;
  era?: string;
  format?: string;
}

@Injectable()
export class CsvDownloadService {
  private readonly logger = new Logger(CsvDownloadService.name);

  constructor(private prisma: PrismaService) {}

  async importFromCsv(options: CsvDownloadOptions): Promise<ImportResult> {
    const startTime = Date.now();
    const result: ImportResult = {
      success: false,
      totalRecords: 0,
      importedRecords: 0,
      skippedRecords: 0,
      errors: [],
      elapsedTimeMs: 0
    };

    this.logger.log(`Starting import from CSV file: ${options.filePath}`);

    try {
      // Используем утилиту для чтения CSV файла
      const records: RawMechCsvRecord[] = await CsvParserUtil.readCsvFile(options.filePath);
      result.totalRecords = records.length;
      
      this.logger.log(`Found ${records.length} records in CSV file`);

      for (const record of records) {
        try {
          await this.processRecord(record, options);
          result.importedRecords++;
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error';
          const errorStack = error instanceof Error 
            ? error.stack 
            : '';
          
          this.logger.error(
            `Error processing record: ${errorMessage}`,
            errorStack,
          );
          result.errors.push(`Error processing record ${record.DBID}: ${errorMessage}`);
          result.skippedRecords++;
        }
      }

      result.success = result.errors.length === 0;
      result.elapsedTimeMs = Date.now() - startTime;

      this.logger.log(
        `Import completed in ${result.elapsedTimeMs}ms. ` +
        `Imported: ${result.importedRecords}, Skipped: ${result.skippedRecords}`,
      );

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';
      const errorStack = error instanceof Error 
        ? error.stack 
        : '';
      
      this.logger.error(
        `Import failed: ${errorMessage}`,
        errorStack,
      );
      result.errors.push(`Import failed: ${errorMessage}`);
      result.elapsedTimeMs = Date.now() - startTime;
      return result;
    }
  }

  private async processRecord(record: RawMechCsvRecord, options: CsvDownloadOptions): Promise<void> {
    // Создаем объект мех с подстановкой значений по умолчанию
    const mechData = this.createMechFromRecord(record);
    
    // Проверяем существует ли уже запись с таким DBID
    const existingMech = await this.prisma.rawMech.findUnique({
      where: { dbId: mechData.dbId },
    });

    if (existingMech && !options.updateExisting) {
      if (options.skipDuplicates) {
        return; // Пропускаем дубликаты, если указана соответствующая опция
      }
      throw new Error(`Mech with DBID ${mechData.dbId} already exists`);
    }

    if (existingMech && options.updateExisting) {
      // Обновляем существующую запись
      await this.prisma.rawMech.update({
        where: { id: existingMech.id },
        data: mechData,
      });
    } else {
      // Создаем новую запись
      await this.prisma.rawMech.create({
        data: mechData,
      });
    }
  }

  private createMechFromRecord(record: RawMechCsvRecord): Prisma.RawMechCreateInput {
    // Значения по умолчанию
    const DEFAULT_TEXT = "Тут пусто";
    const DEFAULT_NUMBER = 13;

    return {
      dbId: this.parseNumberOrDefault(record.DBID, DEFAULT_NUMBER),
      name: record['Name/Model'] || DEFAULT_TEXT,
      unitType: record['Unit Type'] || DEFAULT_TEXT,
      technology: record.Technology || DEFAULT_TEXT,
      chassis: record.Chassis || DEFAULT_TEXT,
      era: record.Era || DEFAULT_TEXT,
      year: this.parseNumberOrDefault(record.Year, DEFAULT_NUMBER),
      rulesLevel: record['Rules Level (Era)'] || DEFAULT_TEXT,
      tonnage: this.parseNumberOrDefault(record.Tonnage, DEFAULT_NUMBER),
      battleValue: this.parseNumberOrDefault(record['Battle Value'], DEFAULT_NUMBER),
      pointValue: this.parseNumberOrDefault(record['Point Value'], DEFAULT_NUMBER),
      cost: record.Cost ? this.parseNumberOrDefault(record.Cost, DEFAULT_NUMBER) : DEFAULT_NUMBER,
      rating: record.Rating || DEFAULT_TEXT,
      designer: record.Designer || DEFAULT_TEXT,
    };
  }

  private parseNumberOrDefault(value: any, defaultValue: number): number {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  // Новые методы для расширенной функциональности
  getDownloadOptions(query: CsvDownloadRequestDto): any {
    return {
      availableMechTypes: ['BattleMech', 'OmniMech', 'IndustrialMech'],
      availableTechnologies: ['Inner Sphere', 'Clan', 'Mixed'],
      availableEras: ['Succession Wars', 'Clan Invasion', 'Dark Age'],
      availableFormats: ['csv', 'json'],
      currentOptions: query
    };
  }

  // Метод для генерации CSV с поддержкой обоих форматов ответа
  async generateCsv(options: CsvDownloadRequestDto): Promise<CsvDownloadResultDto> {
    try {
      // Получаем данные из базы данных с учетом фильтров
      const whereClause: Prisma.RawMechWhereInput = {};
      
      if (options.mechType) {
        whereClause.unitType = options.mechType;
      }
      
      if (options.technology) {
        whereClause.technology = options.technology;
      }
      
      if (options.era) {
        whereClause.era = options.era;
      }
      
      // Получаем данные мехов из базы
      const mechs = await this.prisma.rawMech.findMany({
        where: whereClause,
      });
      
      // Генерируем имя файла с текущей датой и временем
      const fileName = `mechs_${new Date().toISOString().replace(/[:.]/g, '')}.csv`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      
      // Используем утилиту для конвертации в CSV
      const csvContent = CsvParserUtil.convertMechsToCSV(mechs);
      
      // Записываем в файл
      fs.writeFileSync(filePath, csvContent);
      
      // Получаем размер файла
      const stats = fs.statSync(filePath);
      
      // Возвращаем результат в совместимом формате
      return {
        success: true,
        totalRecords: mechs.length,
        importedRecords: mechs.length,
        skippedRecords: 0,
        errors: [],
        elapsedTimeMs: 0,
        status: 'success',
        recordCount: mechs.length,
        fileName: fileName,
        fileSize: stats.size,
        mimeType: 'text/csv',
        downloadUrl: `/api/downloads/${fileName}`
      };
    } catch (error) {
      return {
        success: false,
        totalRecords: 0,
        importedRecords: 0,
        skippedRecords: 0,
        errors: [error.message],
        elapsedTimeMs: 0,
        status: 'error',
        recordCount: 0,
        fileName: '',
        fileSize: 0,
        mimeType: 'text/csv'
      };
    }
  }
}