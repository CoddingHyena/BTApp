import { IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePilotDto {
  @ApiProperty({ 
    description: 'ID фракции для генерации пилота',
    example: 1,
    type: Number
  })
  @IsNumber()
  factionId: number;

  @ApiProperty({ 
    description: 'Пол пилота (опционально)',
    required: false,
    enum: ['male', 'female'],
    example: 'male'
  })
  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: 'male' | 'female';
}
