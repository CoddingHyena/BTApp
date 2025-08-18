import { IsOptional, IsNumber } from 'class-validator';

export class UpdatePlayerFactionDto {
  @IsOptional()
  @IsNumber()
  factionId: number | null;
}
