import { ApiProperty } from '@nestjs/swagger';
import { MissionType, MissionDifficulty } from '@prisma/client';

export class GeneratedMissionDto {
  @ApiProperty({ description: 'Уникальный код миссии', example: 'BT-101' })
  code: string;

  @ApiProperty({ description: 'Название миссии', example: 'Разведка боем' })
  title: string;

  @ApiProperty({ description: 'Описание миссии', required: false })
  description?: string;

  @ApiProperty({ 
    description: 'Дополнительные цели', 
    example: ['Захватить контрольную точку', 'Уничтожить командный центр'],
    type: [String] 
  })
  objectives: string[];

  @ApiProperty({ description: 'Тип миссии', enum: MissionType })
  type: MissionType;

  @ApiProperty({ description: 'Сложность миссии', enum: MissionDifficulty })
  difficulty: MissionDifficulty;

  @ApiProperty({ description: 'Стоимость в Warchest Points', required: false })
  cost?: number;

  @ApiProperty({ description: 'Награда за выполнение', required: false })
  reward?: Record<string, any>;

  @ApiProperty({ description: 'URL схемы расстановки', required: false })
  deploymentUrl?: string;

  @ApiProperty({ description: 'Источник миссии', required: false })
  source?: string;

  @ApiProperty({ description: 'Время генерации' })
  generatedAt: Date;

  @ApiProperty({ 
    description: 'Результат функции чет-нечет', 
    example: true 
  })
  isEven: boolean;

  @ApiProperty({ 
    description: 'Сообщение о блоке миссий', 
    example: 'первый блок' 
  })
  blockMessage: string;

  @ApiProperty({ 
    description: 'Специальное условие поля боя', 
    example: 'Fog of War' 
  })
  battlefieldCondition: string;

  @ApiProperty({ 
    description: 'Погодные условия (массив, так как при сумме 7 может быть два результата)', 
    example: ['Rain', 'Wind'],
    type: [String]
  })
  weatherConditions: string[];
}

