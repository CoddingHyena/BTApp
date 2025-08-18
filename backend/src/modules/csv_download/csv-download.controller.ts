import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CsvDownloadService } from './csv-download.service';
import { CsvDownloadResultDto } from './dto/csv-download-result.dto';
import { CsvDownloadRequestDto } from './dto/csv-download-request.dto';
import * as path from 'path';
import * as fs from 'fs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('csv-download')
@Controller('import/mechs/csv')
export class CsvDownloadController {
  private readonly logger = new Logger(CsvDownloadController.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly csvDownloadService: CsvDownloadService) {
    // Создание директории для загрузок, если её нет
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, `mech-csv-import-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
          cb(null, true);
        } else {
          cb(new Error('Only CSV files are allowed'), false);
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Import mechs from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        skipDuplicates: {
          type: 'boolean',
          default: false,
        },
        updateExisting: {
          type: 'boolean',
          default: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Mechs imported successfully',
    type: CsvDownloadResultDto,
  })
  async importMechsFromCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('skipDuplicates') skipDuplicates: boolean = false,
    @Body('updateExisting') updateExisting: boolean = false,
  ): Promise<CsvDownloadResultDto> {
    this.logger.log(`Received CSV file upload: ${file.originalname}`);
    
    try {
      const result = await this.csvDownloadService.importFromCsv({
        filePath: file.path,
        skipDuplicates,
        updateExisting,
      });
      
      // Удаление временного файла после обработки
      fs.unlinkSync(file.path);
      
      // Конвертируем ImportResult в CsvDownloadResultDto
      return {
        status: result.success ? 'success' : 'error',
        recordCount: result.importedRecords,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        errors: result.errors,
      };
    } catch (error) {
      // Удаление временного файла в случае ошибки
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Download mechs as CSV' })
  @ApiResponse({
    status: 200,
    description: 'CSV file generated successfully',
  })
  async downloadMechsAsCsv(
    @Query() query: CsvDownloadRequestDto,
  ): Promise<CsvDownloadResultDto> {
    this.logger.log('Received CSV download request');
    
    try {
      const result = await this.csvDownloadService.generateCsv(query);
      // Конвертируем результат сервиса в DTO
      return {
        status: result.status || 'success',
        recordCount: result.recordCount || 0,
        fileName: result.fileName || '',
        fileSize: result.fileSize || 0,
        mimeType: result.mimeType || 'text/csv',
        downloadUrl: result.downloadUrl,
        errors: result.errors,
        metadata: result.metadata,
      };
    } catch (error) {
      this.logger.error('Error during CSV download:', error);
      throw error;
    }
  }
}