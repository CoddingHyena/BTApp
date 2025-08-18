import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetGenderFromNameDto {
  @ApiProperty({ 
    description: 'Имя пилота',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'ID фракции',
    example: 1,
    type: Number
  })
  @IsNumber()
  factionId: number;
}
