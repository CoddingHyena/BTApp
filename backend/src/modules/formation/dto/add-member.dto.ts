import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class AddMemberDto {
  @ApiProperty()
  @IsString()
  campaignUnitId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  slotIndex?: number;
}


