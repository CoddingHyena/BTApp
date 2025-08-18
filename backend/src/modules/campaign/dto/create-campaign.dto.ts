import { IsString, IsOptional, IsEnum, IsUUID, IsInt, IsBoolean, IsObject, IsDateString, IsArray, IsNumber } from 'class-validator';
import { CampaignType, CampaignStatus, CampaignAccessType, EventType } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  gameId: string;

  @IsEnum(CampaignType)
  campaignType: CampaignType;

  @IsOptional()
  @IsUUID()
  parentCampaignId?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(CampaignAccessType)
  accessType?: CampaignAccessType;

  @IsOptional()
  @IsInt()
  maxPlayers?: number;

  @IsOptional()
  @IsInt()
  minPlayers?: number;

  @IsOptional()
  @IsObject()
  commonRules?: Record<string, any>;

  @IsOptional()
  @IsObject()
  gameSpecificRules?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  // Специфичные поля для подкампаний
  @IsOptional()
  @IsString()
  geographicScope?: string;

  @IsOptional()
  @IsString()
  thematicFocus?: string;

  // Специфичные поля для событий
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @IsOptional()
  @IsInt()
  durationHours?: number;

  @IsOptional()
  @IsInt()
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  autoGenerate?: boolean;

  @IsOptional()
  @IsObject()
  triggerConditions?: Record<string, any>;

  @IsOptional()
  @IsObject()
  completionConditions?: Record<string, any>;

  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  factionIds?: number[];
} 