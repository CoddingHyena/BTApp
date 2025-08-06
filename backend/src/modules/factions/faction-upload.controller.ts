import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('faction-upload')
@Controller('factions/upload')
export class FactionUploadController {
  private readonly logger = new Logger(FactionUploadController.name);

  constructor() {
    // Создание директорий для загрузок фракций
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'factions');
    const logosDir = path.join(uploadsDir, 'logos');
    const bannersDir = path.join(uploadsDir, 'banners');
    
    [uploadsDir, logosDir, bannersDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    });
  }

  @Post('logo')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Upload faction logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Faction logo file (PNG, JPG, JPEG, SVG)'
        }
      }
    }
  })
  @ApiQuery({ name: 'factionId', required: true, type: 'number', description: 'ID of the faction' })
  @ApiResponse({ 
    status: 200,
    description: 'Logo uploaded successfully',
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
          const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'factions', 'logos');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Сохраняем оригинальное имя файла без изменений
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
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
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Query('factionId') factionId: string,
  ): Promise<{ success: boolean; filename: string; url: string; message: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!factionId) {
      throw new BadRequestException('Faction ID is required');
    }

    try {
      const imageUrl = `/uploads/factions/logos/${file.filename}`;
      
      this.logger.log(`Faction logo uploaded: ${file.filename}, URL: ${imageUrl}, Faction ID: ${factionId}`);
      
      return {
        success: true,
        filename: file.filename,
        url: imageUrl,
        message: `Faction logo uploaded successfully for faction ID: ${factionId}`
      };
    } catch (error) {
      this.logger.error(`Error uploading faction logo: ${error.message}`);
      
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new BadRequestException('Failed to upload faction logo');
    }
  }

  @Post('banner')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Upload faction banner' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Faction banner file (PNG, JPG, JPEG, SVG)'
        }
      }
    }
  })
  @ApiQuery({ name: 'factionId', required: true, type: 'number', description: 'ID of the faction' })
  @ApiResponse({ 
    status: 200,
    description: 'Banner uploaded successfully',
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
          const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'factions', 'banners');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Сохраняем оригинальное имя файла, но добавляем уникальный суффикс для избежания конфликтов
          const originalName = path.basename(file.originalname, path.extname(file.originalname));
          const extension = path.extname(file.originalname);
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          
          // Очищаем имя файла от недопустимых символов
          const cleanName = originalName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
          
          cb(null, `${cleanName}-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
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
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadBanner(
    @UploadedFile() file: Express.Multer.File,
    @Query('factionId') factionId: string,
  ): Promise<{ success: boolean; filename: string; url: string; message: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!factionId) {
      throw new BadRequestException('Faction ID is required');
    }

    try {
      const imageUrl = `/uploads/factions/banners/${file.filename}`;
      
      this.logger.log(`Faction banner uploaded: ${file.filename}, URL: ${imageUrl}, Faction ID: ${factionId}`);
      
      return {
        success: true,
        filename: file.filename,
        url: imageUrl,
        message: `Faction banner uploaded successfully for faction ID: ${factionId}`
      };
    } catch (error) {
      this.logger.error(`Error uploading faction banner: ${error.message}`);
      
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new BadRequestException('Failed to upload faction banner');
    }
  }
} 