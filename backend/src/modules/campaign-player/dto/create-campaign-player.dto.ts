import { IsString, IsOptional, IsInt, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { PlayerStatus, PlayerRole } from '@prisma/client';

export class CreateCampaignPlayerDto {
  @IsString()
  campaignId: string;

  @IsString()
  playerId: string;

  @IsOptional()
  @IsInt()
  factionId?: number;

  @IsOptional()
  @IsEnum(PlayerStatus)
  status?: PlayerStatus;

  @IsOptional()
  @IsEnum(PlayerRole)
  role?: PlayerRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  preferences?: any;

  @IsOptional()
  @IsString()
  notes?: string;
} 