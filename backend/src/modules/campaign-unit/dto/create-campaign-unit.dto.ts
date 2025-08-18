import { IsString, IsOptional, IsInt, IsEnum, IsBoolean } from 'class-validator';
import { UnitType, UnitStatus } from '@prisma/client';

export class CreateCampaignUnitDto {
  @IsString()
  campaignId: string;

  @IsInt()
  factionId: number;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsOptional()
  @IsString()
  unitId?: string; // Связь с базовым юнитом (например, Mech.id)

  @IsString()
  name: string; // Уникальное имя юнита в кампании

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;

  @IsOptional()
  role?: any; // Роль юнита (JSON)

  @IsOptional()
  damageHistory?: any;

  @IsOptional()
  battleHistory?: any;

  @IsOptional()
  @IsString()
  pilotId?: string; // Связь с пилотом
} 