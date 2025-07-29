import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('mission-upload')
@Controller('missions/upload')
export class MissionUploadController {
  private readonly logger = new Logger(MissionUploadController.name);
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads', 'missions');

  constructor() {
    // Создание директории для загрузок миссий, если её нет
    this.logger.log(`Initializing upload directory: ${this.uploadDir}`);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    } else {
      this.logger.log(`Upload directory already exists: ${this.uploadDir}`);
    }
  }

  @Post('deployment-image')
  @ApiOperation({ summary: 'Upload deployment image for mission' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Deployment image file (PNG, JPG, JPEG, SVG)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        filename: { type: 'string' },
        url: { type: 'string' },
        message: { type: 'string' }
      }
    }
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'missions');
          console.log(`Upload destination: ${uploadPath}`);
          // Создаем папку, если её нет
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`Created upload directory: ${uploadPath}`);
          } else {
            console.log(`Upload directory exists: ${uploadPath}`);
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, `mission-deployment-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Проверяем MIME тип и расширение файла
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
        
        const fileExtension = path.extname(file.originalname).toLowerCase();
        
        if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PNG, JPG, JPEG, and SVG files are allowed'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB максимальный размер
      },
    }),
  )
  async uploadDeploymentImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ success: boolean; filename: string; url: string; message: string }> {
    this.logger.log(`Received deployment image upload: ${file?.originalname || 'unknown'}`);
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Проверяем, что файл действительно сохранен
      const expectedPath = path.join(process.cwd(), 'public', 'uploads', 'missions', file.filename);
      this.logger.log(`Expected file path: ${expectedPath}`);
      this.logger.log(`File exists: ${fs.existsSync(expectedPath)}`);
      
      // Возвращаем информацию о загруженном файле
      const imageUrl = `/uploads/missions/${file.filename}`;
      
      this.logger.log(`File saved successfully: ${file.filename}, URL: ${imageUrl}`);
      
      return {
        success: true,
        filename: file.filename,
        url: imageUrl,
        message: 'Deployment image uploaded successfully'
      };
    } catch (error) {
      this.logger.error(`Error uploading deployment image: ${error.message}`);
      
      // Удаляем файл в случае ошибки
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new BadRequestException('Failed to upload deployment image');
    }
  }
} 