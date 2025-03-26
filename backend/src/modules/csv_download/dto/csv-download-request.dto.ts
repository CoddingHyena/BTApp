import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CsvDownloadRequestDto {
  @ApiProperty({
    description: 'Flag to determine if default values should be applied to missing fields',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  applyDefaults?: boolean = true;

  @ApiProperty({
    description: 'Type of mechs to download (optional filter)',
    required: false,
    example: 'BattleMech',
  })
  @IsString()
  @IsOptional()
  mechType?: string;

  @ApiProperty({
    description: 'Technology type filter (e.g. "Inner Sphere", "Clan")',
    required: false,
    example: 'Inner Sphere',
  })
  @IsString()
  @IsOptional()
  technology?: string;

  @ApiProperty({
    description: 'Era filter (e.g. "Succession Wars", "Clan Invasion")',
    required: false,
    example: 'Clan Invasion',
  })
  @IsString()
  @IsOptional()
  era?: string;

  @ApiProperty({
    description: 'Format for the download (e.g. "csv", "json")',
    required: false,
    default: 'csv',
    enum: ['csv', 'json'],
  })
  @IsString()
  @IsOptional()
  format?: string = 'csv';
}