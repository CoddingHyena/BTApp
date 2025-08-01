import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateRawMechDto {
  @ApiProperty({ 
    description: 'Статус валидации меха', 
    example: true,
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  validated?: boolean;
}
