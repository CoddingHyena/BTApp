import { IsString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateNameDto {
  @ApiProperty({ 
    description: 'Имя пилота',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'Фамилия пилота',
    example: 'Smith'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Пол пилота',
    enum: ['male', 'female'],
    example: 'male'
  })
  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({ 
    description: 'ID фракции',
    example: 1,
    type: Number
  })
  @IsNumber()
  factionId: number;
}
