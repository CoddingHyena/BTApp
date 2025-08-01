import { IsString, IsInt, IsOptional, IsBoolean, Min, Max, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFactionDto {
  @ApiProperty({ description: 'Название фракции' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Уникальный код фракции' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Основной цвет фракции в HEX формате', required: false, example: '#FF0000' })
  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @ApiProperty({ description: 'Вторичный цвет фракции в HEX формате', required: false, example: '#0000FF' })
  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;

  @ApiProperty({ description: 'Год формирования фракции', required: false, example: 2571 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(4000)
  formationYear?: number;

  @ApiProperty({ description: 'Год роспуска фракции (null если существует)', required: false, example: 2780 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(4000)
  dissolutionYear?: number;

  @ApiProperty({ description: 'Описание фракции', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Путь к логотипу фракции', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Путь к баннеру фракции', required: false })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ description: 'ID игры, к которой относится фракция', required: false })
  @IsOptional()
  @IsString()
  gameIdRef?: string;

  @ApiProperty({ description: 'Является ли фракция основной', default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isMajor?: boolean;

  @ApiProperty({ description: 'Активна ли фракция', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}