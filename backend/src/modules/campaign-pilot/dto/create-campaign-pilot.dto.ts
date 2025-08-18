import { IsString, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator';
import { FormationMemberRole, PilotSpecialization, PilotStatus, Gender } from '@prisma/client';

export class CreateCampaignPilotDto {
  @IsString()
  campaignId: string;

  @IsInt()
  factionId: number;

  @IsString()
  firstName: string; // Имя пилота

  @IsString()
  lastName: string; // Фамилия пилота

  @IsString()
  callsign: string; // Позывной пилота

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender; // Пол пилота

  @IsOptional()
  @IsEnum(FormationMemberRole)
  rank?: FormationMemberRole;

  @IsInt()
  @Min(3)
  @Max(7)
  gunnery: number; // Навык стрельбы (3-7, где 3 - лучший)

  @IsInt()
  @Min(4)
  @Max(8)
  piloting: number; // Навык пилотирования (4-8, где 4 - лучший)

  @IsInt()
  @Min(1)
  @Max(10)
  alphaStrikeSkill: number; // Навык пилота в Alpha Strike

  @IsOptional()
  @IsInt()
  experience?: number;

  @IsOptional()
  @IsEnum(PilotSpecialization)
  specialization?: PilotSpecialization;

  @IsOptional()
  specialAbilities?: any; // JSON

  @IsOptional()
  @IsEnum(PilotStatus)
  status?: PilotStatus;

  @IsOptional()
  battleHistory?: any; // JSON

  @IsOptional()
  awards?: any; // JSON

  @IsOptional()
  @IsInt()
  cost?: number;
}
