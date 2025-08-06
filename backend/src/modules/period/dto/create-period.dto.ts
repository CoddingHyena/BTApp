// create-period.dto.ts

import { IsString, IsInt, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeriodDto {
  @ApiProperty({ description: 'Название периода' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Уникальный код периода' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Год начала периода', example: 2571 })
  @IsInt()
  @Min(2000)
  @Max(4000)
  startYear: number;

  @ApiProperty({ description: 'Год окончания периода (null для текущих периодов)', required: false, example: 2781 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(4000)
  endYear?: number;

  @ApiProperty({ description: 'Порядок сортировки', example: 10 })
  @IsInt()
  sortOrder: number;

  @ApiProperty({ description: 'Описание периода', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Путь к изображению периода', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Путь к баннеру периода', required: false })
  @IsOptional()
  @IsString()
  bannerUrl?: string;


}