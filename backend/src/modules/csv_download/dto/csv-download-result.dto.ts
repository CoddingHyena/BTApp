import { ApiProperty } from '@nestjs/swagger';

export class CsvDownloadResultDto {
  @ApiProperty({
    description: 'Status of the CSV download operation',
    example: 'success',
    enum: ['success', 'partial_success', 'error'],
  })
  status: string;

  @ApiProperty({
    description: 'Number of records downloaded',
    example: 150,
  })
  recordCount: number;

  @ApiProperty({
    description: 'File name of the downloaded CSV',
    example: 'mechs_20250325_123045.csv',
  })
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 24680,
  })
  fileSize: number;

  @ApiProperty({
    description: 'MIME type of the downloaded file',
    example: 'text/csv',
  })
  mimeType: string;

  @ApiProperty({
    description: 'URL to download the file (if applicable)',
    example: '/api/downloads/mechs_20250325_123045.csv',
    required: false,
  })
  downloadUrl?: string;

  @ApiProperty({
    description: 'Any errors that occurred during processing',
    required: false,
    type: [String],
  })
  errors?: string[];

  @ApiProperty({
    description: 'Additional metadata about the download',
    required: false,
    type: Object,
  })
  metadata?: Record<string, any>;
}