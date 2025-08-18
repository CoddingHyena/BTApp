import { IsString, IsOptional, IsInt, IsNumber, IsDateString } from 'class-validator';

export class CreateCampaignProgressDto {
  @IsString()
  campaignId: string;

  @IsString()
  playerId: string;

  @IsOptional()
  @IsInt()
  winStreak?: number;

  @IsOptional()
  @IsInt()
  lossStreak?: number;

  @IsOptional()
  @IsInt()
  battlesWon?: number;

  @IsOptional()
  @IsInt()
  battlesLost?: number;

  @IsOptional()
  @IsInt()
  battlesDrawn?: number;

  @IsOptional()
  achievements?: any;

  @IsOptional()
  medals?: any;

  @IsOptional()
  @IsInt()
  rating?: number;

  @IsOptional()
  @IsString()
  rank?: string;

  @IsOptional()
  @IsDateString()
  firstBattleDate?: string;

  @IsOptional()
  @IsDateString()
  lastBattleDate?: string;
} 