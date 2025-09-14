import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CombatFormationType } from '@prisma/client';

export class CreateFormationDto {
  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty()
  @IsInt()
  factionId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CombatFormationType })
  @IsEnum(CombatFormationType)
  type: CombatFormationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentFormationId?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCommandLance?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCommanderCompany?: boolean;
}


