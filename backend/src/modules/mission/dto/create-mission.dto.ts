// create-mission.dto.ts
import { IsString, IsArray, IsEnum, IsOptional, IsInt, IsBoolean, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MissionType, MissionDifficulty } from '@prisma/client';

export class CreateMissionDto {
  @ApiProperty({ description: 'Уникальный код миссии (формат BT-XXX)', example: 'BT-101' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Название миссии', example: 'Разведка боем' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Описание миссии (Markdown поддерживается)', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Дополнительные цели', 
    example: ['Захватить контрольную точку', 'Уничтожить командный центр'],
    type: [String] 
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  objectives: string[];

  @ApiProperty({ description: 'Тип миссии', enum: MissionType })
  @IsEnum(MissionType)
  type: MissionType;

  @ApiProperty({ description: 'Сложность миссии', enum: MissionDifficulty })
  @IsEnum(MissionDifficulty)
  difficulty: MissionDifficulty;

  @ApiProperty({ description: 'Стоимость в Warchest Points', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  cost?: number;

  @ApiProperty({ 
    description: 'Награда за выполнение', 
    required: false,
    example: { warchestPoints: 10, bonuses: ['+1 к броне'] }
  })
  @IsOptional()
  reward?: Record<string, any>;

  @ApiProperty({ description: 'URL схемы расстановки', required: false })
  @IsOptional()
  @IsString()
  deploymentUrl?: string;

  @ApiProperty({ description: 'Официальная миссия (true) или пользовательская (false)', default: true })
  @IsOptional()
  @IsBoolean()
  isOfficial?: boolean;
}