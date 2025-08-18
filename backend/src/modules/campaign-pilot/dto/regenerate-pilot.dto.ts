import { IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegeneratePilotDto {
  @ApiProperty({ 
    description: 'ID фракции для перегенерации пилота',
    example: 1,
    type: Number
  })
  @IsNumber()
  factionId: number;

  @ApiProperty({ 
    description: 'Текущий пол пилота (опционально)',
    required: false,
    enum: ['male', 'female'],
    example: 'male'
  })
  @IsOptional()
  @IsIn(['male', 'female'])
  currentGender?: 'male' | 'female';
}
