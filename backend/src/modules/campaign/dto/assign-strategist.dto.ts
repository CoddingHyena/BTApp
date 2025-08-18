import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class AssignStrategistDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @IsNotEmpty()
  factionId: number;
}
