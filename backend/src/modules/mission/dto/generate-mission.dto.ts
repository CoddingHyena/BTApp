import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MissionType, MissionDifficulty } from '@prisma/client';

export class GenerateMissionDto {
  @ApiProperty({ 
    description: 'Тип миссии (если не указан - выбирается случайно)', 
    enum: MissionType,
    required: false 
  })
  @IsOptional()
  @IsEnum(MissionType)
  type?: MissionType;

  @ApiProperty({ 
    description: 'Сложность миссии (если не указана - выбирается случайно)', 
    enum: MissionDifficulty,
    required: false 
  })
  @IsOptional()
  @IsEnum(MissionDifficulty)
  difficulty?: MissionDifficulty;

  @ApiProperty({ 
    description: 'Минимальное количество целей', 
    required: false,
    default: 1,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  minObjectives?: number;

  @ApiProperty({ 
    description: 'Максимальное количество целей', 
    required: false,
    default: 3,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  maxObjectives?: number;
}

