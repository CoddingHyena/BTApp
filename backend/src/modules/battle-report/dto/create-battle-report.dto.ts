import { IsString, IsOptional, IsInt, IsNumber, IsDate, IsEnum, IsBoolean } from 'class-validator';
import { BattleResult } from '@prisma/client';

export class CreateBattleReportDto {
  @IsString()
  campaignId: string;

  @IsString()
  playerId: string;

  @IsOptional()
  @IsString()
  opponentId?: string;

  @IsDate()
  battleDate: Date;

  @IsEnum(BattleResult)
  result: BattleResult;

  @IsOptional()
  data?: any;

  @IsOptional()
  @IsString()
  missionId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  playerFaction?: string;

  @IsOptional()
  @IsString()
  opponentFaction?: string;

  @IsOptional()
  playerForce?: any;



  @IsOptional()
  @IsInt()
  victoryPoints?: number;

  @IsOptional()
  @IsInt()
  battleValue?: number;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  verifiedBy?: string;

  @IsOptional()
  @IsDate()
  verifiedAt?: Date;

  @IsOptional()
  @IsString()
  playerNotes?: string;

  @IsOptional()
  @IsString()
  moderatorNotes?: string;
} 