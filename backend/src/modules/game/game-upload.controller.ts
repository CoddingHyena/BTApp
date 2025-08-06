import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('game-upload')
@Controller('games/upload')
export class GameUploadController {
  private readonly logger = new Logger(GameUploadController.name);

  constructor() {
    // Создание директорий для загрузок игр
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'games');
    const iconsDir = path.join(uploadsDir, 'icons');
    const bannersDir = path.join(uploadsDir, 'banners');
    
    [uploadsDir, iconsDir, bannersDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    });
  }

  @Post('icon')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Upload game icon' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Game icon file (PNG, JPG, JPEG, SVG)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200,
    description: 'Icon uploaded successfully',
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
          const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'games', 'icons');
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
  async uploadIcon(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ success: boolean; filename: string; url: string; message: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = `/uploads/games/icons/${file.filename}`;
      
      this.logger.log(`Game icon uploaded: ${file.filename}, URL: ${imageUrl}`);
      
      return {
        success: true,
        filename: file.filename,
        url: imageUrl,
        message: 'Game icon uploaded successfully'
      };
    } catch (error) {
      this.logger.error(`Error uploading game icon: ${error.message}`);
      
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new BadRequestException('Failed to upload game icon');
    }
  }

  @Post('banner')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Upload game banner' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Game banner file (PNG, JPG, JPEG, SVG)'
        }
      }
    }
  })
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
          const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'games', 'banners');
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
  ): Promise<{ success: boolean; filename: string; url: string; message: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = `/uploads/games/banners/${file.filename}`;
      
      this.logger.log(`Game banner uploaded: ${file.filename}, URL: ${imageUrl}`);
      
      return {
        success: true,
        filename: file.filename,
        url: imageUrl,
        message: 'Game banner uploaded successfully'
      };
    } catch (error) {
      this.logger.error(`Error uploading game banner: ${error.message}`);
      
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new BadRequestException('Failed to upload game banner');
    }
  }
} 