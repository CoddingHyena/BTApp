import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateCampaignEconomyDto {
  @IsString()
  campaignId: string;

  @IsString()
  playerId: string;

  @IsOptional()
  @IsInt()
  currentFunds?: number;

  @IsOptional()
  @IsInt()
  incomePerTurn?: number;

  @IsOptional()
  @IsInt()
  repairCosts?: number;

  @IsOptional()
  @IsInt()
  startingFunds?: number;

  @IsOptional()
  @IsInt()
  totalIncome?: number;

  @IsOptional()
  @IsInt()
  totalExpenses?: number;

  @IsOptional()
  @IsInt()
  debt?: number;

  @IsOptional()
  @IsInt()
  unitPurchaseCosts?: number;

  @IsOptional()
  @IsInt()
  maintenanceCosts?: number;

  @IsOptional()
  @IsInt()
  transportCosts?: number;

  @IsOptional()
  @IsInt()
  diplomaticCosts?: number;

  @IsOptional()
  @IsInt()
  battleRewards?: number;

  @IsOptional()
  @IsInt()
  territoryIncome?: number;

  @IsOptional()
  @IsInt()
  tradeIncome?: number;

  @IsOptional()
  transactions?: any;
} 