import { IsString, IsInt, IsOptional, Min, Max, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMechAvailabilityDto {
  @ApiProperty({ description: 'ID меха' })
  @IsString()
  @IsUUID()
  mechId: string;

  @ApiProperty({ description: 'ID фракции' })
  @IsInt()
  factionId: number;

  @ApiProperty({ description: 'ID периода' })
  @IsInt()
  periodId: number;

  @ApiProperty({ 
    description: 'Уровень доступности', 
    enum: ['common', 'uncommon', 'rare', 'very_rare', 'prototype'] 
  })
  @IsString()
  @IsIn(['common', 'uncommon', 'rare', 'very_rare', 'prototype'])
  availabilityLevel: string;

  @ApiProperty({ description: 'Год введения в эксплуатацию', required: false, example: 3025 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(4000)
  introducedYear?: number;

  @ApiProperty({ description: 'Примечания', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}