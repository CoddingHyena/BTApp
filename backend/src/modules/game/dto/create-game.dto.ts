import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameCategory } from '@prisma/client';

export class CreateGameDto {
  @ApiProperty({ description: 'Название игры' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Описание игры', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Категория игры', 
    enum: GameCategory,
    example: 'TACTICAL'
  })
  @IsEnum(GameCategory)
  category: GameCategory;

  @ApiProperty({ description: 'Путь к иконке игры', required: false })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({ description: 'Путь к баннеру игры', required: false })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ description: 'Активна ли игра', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Порядок сортировки' })
  @IsInt()
  @Min(1)
  @Max(1000)
  sortOrder: number;
} 