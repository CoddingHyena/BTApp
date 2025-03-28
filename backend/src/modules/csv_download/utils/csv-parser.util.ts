// src/modules/csv_download/utils/csv-parser.util.ts
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { RawMechCsvRecord } from '../interfaces/raw-mech-csv-record.interface';

/**
 * Утилиты для работы с CSV-файлами мехов
 */
export class CsvParserUtil {
  /**
   * Читает CSV-файл и возвращает массив записей MechCsvRecord
   * @param filePath Путь к CSV-файлу
   * @param options Опции парсинга CSV
   * @returns Promise с массивом записей MechCsvRecord
   */
  static readCsvFile(
    filePath: string, 
    options: { 
      skipFirstLine?: boolean;
      delimiter?: string;
      encoding?: BufferEncoding;
    } = {}
  ): Promise<RawMechCsvRecord[]> {
    return new Promise((resolve, reject) => {
      const results: RawMechCsvRecord[] = [];
      
      // Настройки по умолчанию
      const delimiter = options.delimiter || ',';
      const encoding = options.encoding || 'utf8';
      
      fs.createReadStream(filePath, { encoding })
        .pipe(csvParser({ separator: delimiter }))
        .on('data', (data: RawMechCsvRecord) => results.push(data))
        .on('error', (error) => reject(error))
        .on('end', () => resolve(results));
    });
  }
  
  /**
   * Проверяет, что CSV-файл содержит необходимые заголовки
   * @param filePath Путь к CSV-файлу
   * @returns Promise<boolean> - содержит ли файл необходимые заголовки
   */
  static async validateCsvHeaders(filePath: string): Promise<boolean> {
    const requiredHeaders = [
      'DBID', 
      'Name/Model', 
      'Unit Type', 
      'Technology', 
      'Chassis', 
      'Era'
    ];
    
    try {
      // Читаем только первую строку для проверки заголовков
      return new Promise((resolve, reject) => {
        let headersChecked = false;
        
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('headers', (headers: string[]) => {
            headersChecked = true;
            
            // Проверяем наличие всех необходимых заголовков
            const hasAllRequired = requiredHeaders.every(
              required => headers.includes(required)
            );
            
            resolve(hasAllRequired);
          })
          .on('error', (error) => reject(error))
          .on('end', () => {
            if (!headersChecked) {
              resolve(false); // Файл пуст или не содержит заголовков
            }
          });
      });
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Конвертирует массив записей мехов в CSV-строку
   * @param mechs Массив объектов мехов
   * @returns CSV-строка
   */
  static convertMechsToCSV(mechs: any[]): string {
    // Если нет мехов, возвращаем только заголовки
    if (!mechs.length) {
      return 'DBID,Name/Model,Unit Type,Technology,Chassis,Era,Year,Rules Level,Tonnage,Battle Value,Point Value,Cost,Rating,Designer\n';
    }
    
    // Заголовки CSV
    const headers = [
      'DBID', 
      'Name/Model', 
      'Unit Type', 
      'Technology', 
      'Chassis', 
      'Era', 
      'Year', 
      'Rules Level', 
      'Tonnage', 
      'Battle Value', 
      'Point Value', 
      'Cost', 
      'Rating', 
      'Designer'
    ];
    
    // Преобразуем данные в формат CSV
    const rows = mechs.map(mech => {
      return [
        mech.dbId,
        mech.name,
        mech.unitType,
        mech.technology,
        mech.chassis,
        mech.era,
        mech.year,
        mech.rulesLevel,
        mech.tonnage,
        mech.battleValue,
        mech.pointValue,
        mech.cost,
        mech.rating,
        mech.designer
      ].map(value => `"${value || ''}"`).join(',');
    });
    
    // Объединяем заголовки и строки
    return headers.join(',') + '\n' + rows.join('\n');
  }
}