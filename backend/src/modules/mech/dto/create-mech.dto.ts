import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMechDto {
  @ApiProperty({ description: 'DBID из CSV' })
  @IsInt()
  dbId: number;

  @ApiProperty({ description: 'Название/модель меха' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Тип юнита' })
  @IsString()
  unitType: string;

  @ApiProperty({ description: 'Технология' })
  @IsString()
  technology: string;

  @ApiProperty({ description: 'Шасси' })
  @IsString()
  chassis: string;

  @ApiProperty({ description: 'Эра' })
  @IsString()
  era: string;

  @ApiProperty({ description: 'Год' })
  @IsInt()
  year: number;

  @ApiProperty({ description: 'Уровень правил' })
  @IsString()
  rulesLevel: string;

  @ApiProperty({ description: 'Тоннаж' })
  @IsNumber()
  tonnage: number;

  @ApiProperty({ description: 'Боевая ценность' })
  @IsInt()
  battleValue: number;

  @ApiProperty({ description: 'Ценность в очках' })
  @IsInt()
  pointValue: number;

  @ApiProperty({ description: 'Стоимость', required: false })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ description: 'Рейтинг', required: false })
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiProperty({ description: 'Дизайнер', required: false })
  @IsOptional()
  @IsString()
  designer?: string;

  @ApiProperty({ description: 'Ссылка на Alpha Strike карточку', required: false })
  @IsOptional()
  @IsString()
  alphaCard?: string;

  @ApiProperty({ description: 'Ссылка на Record Sheet', required: false })
  @IsOptional()
  @IsString()
  recSheet?: string;

  @ApiProperty({ description: 'Ссылка на видео/изображение', required: false })
  @IsOptional()
  @IsString()
  vid?: string;

  @ApiProperty({ description: 'ID исходного RawMech', required: false })
  @IsOptional()
  @IsString()
  rawMechId?: string;
}
