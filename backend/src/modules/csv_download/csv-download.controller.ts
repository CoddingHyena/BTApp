// // src/modules/import/controllers/mech-csv-import.controller.ts

// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   Body,
//   Logger,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { MechCsvImportService } from './csv-download.service';
// import { ImportResultDto } from './csv-download-result.dto';
// import * as path from 'path';
// import * as fs from 'fs';



// @Controller('api/import/mechs/csv')
// export class MechCsvImportController {
//   private readonly logger = new Logger(MechCsvImportController.name);
//   private readonly uploadDir = path.join(process.cwd(), 'uploads');

//   constructor(private readonly mechCsvImportService: MechCsvImportService) {
//     // Создание директории для загрузок, если её нет
//     if (!fs.existsSync(this.uploadDir)) {
//       fs.mkdirSync(this.uploadDir, { recursive: true });
//     }
//   }

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           cb(null, 'uploads/');
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const extension = path.extname(file.originalname);
//           cb(null, `mech-csv-import-${uniqueSuffix}${extension}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
//           cb(null, true);
//         } else {
//           cb(new Error('Only CSV files are allowed'), false);
//         }
//       },
//     }),
//   )
//   async importMechsFromCsv(
//     @UploadedFile() file: Express.Multer.File,
//     @Body('skipDuplicates') skipDuplicates: boolean = false,
//     @Body('updateExisting') updateExisting: boolean = false,
//   ): Promise<ImportResultDto> {
//     this.logger.log(`Received CSV file upload: ${file.originalname}`);
    
//     try {
//       const result = await this.mechCsvImportService.importFromCsv({
//         filePath: file.path,
//         skipDuplicates,
//         updateExisting,
//       });
      
//       // Удаление временного файла после обработки
//       fs.unlinkSync(file.path);
      
//       return result;
//     } catch (error) {
//       // Удаление временного файла в случае ошибки
//       if (fs.existsSync(file.path)) {
//         fs.unlinkSync(file.path);
//       }
      
//       throw error;
//     }
//   }
// }

// src/modules/csv_download/csv-download.controller.ts

// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   Body,
//   Logger,
//   Get,
//   Query,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { CsvDownloadService } from './csv-download.service';
// import { CsvDownloadResultDto } from './dto/csv-download-result.dto';
// import { CsvDownloadRequestDto } from './dto/csv-download-request.dto';
// import * as path from 'path';
// import * as fs from 'fs';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiConsumes,
//   ApiBody,
// } from '@nestjs/swagger';

// @ApiTags('csv-download')
// @Controller('api/import/mechs/csv')
// export class CsvDownloadController {
//   private readonly logger = new Logger(CsvDownloadController.name);
//   private readonly uploadDir = path.join(process.cwd(), 'uploads');

//   constructor(private readonly csvDownloadService: CsvDownloadService) {
//     // Создание директории для загрузок, если её нет
//     if (!fs.existsSync(this.uploadDir)) {
//       fs.mkdirSync(this.uploadDir, { recursive: true });
//     }
//   }

//   @Post()
//   @ApiOperation({ summary: 'Import mechs from CSV file' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: {
//           type: 'string',
//           format: 'binary',
//           description: 'CSV file with mech data'
//         },
//         skipDuplicates: {
//           type: 'boolean',
//           description: 'Skip duplicate records'
//         },
//         updateExisting: {
//           type: 'boolean',
//           description: 'Update existing records'
//         }
//       }
//     }
//   })
//   @ApiResponse({ 
//     status: 200,
//     description: 'CSV file successfully imported',
//     type: CsvDownloadResultDto
//   })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           cb(null, 'uploads/');
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const extension = path.extname(file.originalname);
//           cb(null, `mech-csv-import-${uniqueSuffix}${extension}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
//           cb(null, true);
//         } else {
//           cb(new Error('Only CSV files are allowed'), false);
//         }
//       },
//     }),
//   )
//   async importMechsFromCsv(
//     @UploadedFile() file: Express.Multer.File,
//     @Body('skipDuplicates') skipDuplicates: boolean = false,
//     @Body('updateExisting') updateExisting: boolean = false,
//   ): Promise<CsvDownloadResultDto> {
//     this.logger.log(`Received CSV file upload: ${file.originalname}`);
    
//     try {
//       const result = await this.csvDownloadService.importFromCsv({
//         filePath: file.path,
//         skipDuplicates,
//         updateExisting,
//       });
      
//       // Удаление временного файла после обработки
//       fs.unlinkSync(file.path);
      
//       return result;
//     } catch (error) {
//       // Удаление временного файла в случае ошибки
//       if (fs.existsSync(file.path)) {
//         fs.unlinkSync(file.path);
//       }
      
//       throw error;
//     }
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get CSV download options' })
//   @ApiResponse({ 
//     status: 200, 
//     description: 'Available download options' 
//   })
//   getDownloadOptions(@Query() query: CsvDownloadRequestDto): any {
//     return this.csvDownloadService.getDownloadOptions(query);
//   }
// }

// src/modules/csv_download/csv-download.controller.ts

// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   Body,
//   Logger,
//   Get,
//   Query,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { CsvDownloadService, CsvDownloadResultDto, CsvDownloadRequestDto } from './csv-download.service';
// import * as path from 'path';
// import * as fs from 'fs';
// import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

// @ApiTags('csv-download')
// @Controller('api/import/mechs/csv')
// export class CsvDownloadController {
//   private readonly logger = new Logger(CsvDownloadController.name);
//   private readonly uploadDir = path.join(process.cwd(), 'uploads');

//   constructor(private readonly csvDownloadService: CsvDownloadService) {
//     // Создание директории для загрузок, если её нет
//     if (!fs.existsSync(this.uploadDir)) {
//       fs.mkdirSync(this.uploadDir, { recursive: true });
//     }
//   }

//   @Post()
//   @ApiOperation({ summary: 'Import mechs from CSV file' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: {
//           type: 'string',
//           format: 'binary',
//           description: 'CSV file with mech data'
//         },
//         skipDuplicates: {
//           type: 'boolean',
//           description: 'Skip duplicate records'
//         },
//         updateExisting: {
//           type: 'boolean',
//           description: 'Update existing records'
//         }
//       }
//     }
//   })
//   @ApiResponse({ 
//     status: 200,
//     description: 'CSV file successfully imported'
//   })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           cb(null, 'uploads/');
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const extension = path.extname(file.originalname);
//           cb(null, `mech-csv-import-${uniqueSuffix}${extension}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
//           cb(null, true);
//         } else {
//           cb(new Error('Only CSV files are allowed'), false);
//         }
//       },
//     }),
//   )
//   async importMechsFromCsv(
//     @UploadedFile() file: Express.Multer.File,
//     @Body('skipDuplicates') skipDuplicates: boolean = false,
//     @Body('updateExisting') updateExisting: boolean = false,
//   ): Promise<CsvDownloadResultDto> {
//     this.logger.log(`Received CSV file upload: ${file.originalname}`);
    
//     try {
//       const result = await this.csvDownloadService.importFromCsv({
//         filePath: file.path,
//         skipDuplicates,
//         updateExisting,
//       });
      
//       // Удаление временного файла после обработки
//       fs.unlinkSync(file.path);
      
//       return result;
//     } catch (error) {
//       // Удаление временного файла в случае ошибки
//       if (fs.existsSync(file.path)) {
//         fs.unlinkSync(file.path);
//       }
      
//       throw error;
//     }
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get CSV download options' })
//   @ApiResponse({ 
//     status: 200, 
//     description: 'Available download options' 
//   })
//   getDownloadOptions(@Query() query: CsvDownloadRequestDto): any {
//     return this.csvDownloadService.getDownloadOptions(query);
//   }
// }

// src/modules/csv_download/csv-download.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Logger,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CsvDownloadService, ImportResult, CsvDownloadRequestDto } from './csv-download.service';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Import mechs from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with mech data'
        },
        skipDuplicates: {
          type: 'boolean',
          description: 'Skip duplicate records'
        },
        updateExisting: {
          type: 'boolean',
          description: 'Update existing records'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200,
    description: 'CSV file successfully imported'
  })
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
  async importRawMechsFromCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('skipDuplicates') skipDuplicates: boolean = false,
    @Body('updateExisting') updateExisting: boolean = false,
  ): Promise<ImportResult> {
    this.logger.log(`Received CSV file upload: ${file.originalname}`);
    
    try {
      const result = await this.csvDownloadService.importFromCsv({
        filePath: file.path,
        skipDuplicates,
        updateExisting,
      });
      
      // Удаление временного файла после обработки
      fs.unlinkSync(file.path);
      
      return result;
    } catch (error) {
      // Удаление временного файла в случае ошибки
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get CSV download options' })
  @ApiResponse({ 
    status: 200, 
    description: 'Available download options' 
  })
  getDownloadOptions(@Query() query: CsvDownloadRequestDto): any {
    return this.csvDownloadService.getDownloadOptions(query);
  }
}