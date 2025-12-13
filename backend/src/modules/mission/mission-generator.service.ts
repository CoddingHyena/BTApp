import { Injectable } from '@nestjs/common';
import { GenerateMissionDto } from './dto/generate-mission.dto';
import { GeneratedMissionDto } from './dto/generated-mission.dto';

@Injectable()
export class MissionGeneratorService {
  // Первый блок миссий (для нечетного результата)
  private readonly firstBlockMissions = [
    'Ambush',
    'Annihilation',
    'Breakthrough',
    'Control the Field',
    'Extraction',
    'Focal Point',
  ];

  // Второй блок миссий (для четного результата)
  private readonly secondBlockMissions = [
    'General Melee',
    'Hold the Line',
    'Objective Raid',
    'Recon',
    'Steel Rain',
    'Urban Sweep',
  ];

  // Специальные условия поля боя (Battlefield Conditions)
  private readonly battlefieldConditions = [
    'Battlefield Conditions',
    'Edge',
    'Edge: Commanders',
    'Fog of War',
    'Knife-Fight',
    'Random Duration',
  ];

  // Погодные условия на основе суммы 2d6
  private readonly weatherConditions: Record<number, string> = {
    2: 'Extreme Cold*',
    3: 'Extreme Cold*',
    4: 'Wind',
    5: 'Snowfall',
    6: 'Night',
    7: 'Roll twice, applying both results.**', // Особый случай - нужно бросать дважды
    8: 'Rain',
    9: 'Gravity***',
    10: 'Low Visibility',
    11: 'Extreme Heat*',
    12: 'Extreme Heat*',
  };

  /**
   * Алгоритм Фишера-Йетса для перемешивания массива
   * @param array Массив для перемешивания
   * @returns Перемешанный массив
   */
  private fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Функция "чет-нечет"
   * Создает массив чисел от 1 до 10, перемешивает его алгоритмом Фишера-Йетса,
   * берет первое число и проверяет, делится ли оно на 2 без остатка
   * @returns true если число четное, false если нечетное
   */
  private isEven(): boolean {
    // Создаем массив чисел от 1 до 10
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    
    // Перемешиваем массив алгоритмом Фишера-Йетса
    const shuffled = this.fisherYatesShuffle(numbers);
    
    // Берем первое число из перемешанного массива
    const firstNumber = shuffled[0];
    
    // Проверяем, делится ли число на 2 без остатка
    return firstNumber % 2 === 0;
  }

  /**
   * Выбор случайной миссии из блока
   * @param isEvenResult Результат функции чет-нечет
   * @returns Объект с информацией о блоке и выбранной миссии
   */
  private selectMissionFromBlock(isEvenResult: boolean): {
    blockMessage: string;
    selectedMission: string;
  } {
    // Определяем блок на основе результата isEven()
    const blockMissions = isEvenResult 
      ? this.secondBlockMissions  // true -> второй блок
      : this.firstBlockMissions;  // false -> первый блок

    const blockMessage = isEvenResult 
      ? 'второй блок' 
      : 'первый блок';

    // Перемешиваем массив миссий алгоритмом Фишера-Йетса
    const shuffledMissions = this.fisherYatesShuffle(blockMissions);

    // Берем первую миссию из перемешанного массива
    const selectedMission = shuffledMissions[0];

    return {
      blockMessage,
      selectedMission,
    };
  }

  /**
   * Выбор случайного специального условия поля боя
   * Перемешивает массив условий алгоритмом Фишера-Йетса и берет первое значение
   * @returns Выбранное условие поля боя
   */
  private selectBattlefieldCondition(): string {
    // Перемешиваем массив условий алгоритмом Фишера-Йетса
    const shuffledConditions = this.fisherYatesShuffle(this.battlefieldConditions);

    // Берем первое значение из перемешанного массива
    return shuffledConditions[0];
  }

  /**
   * Выбор случайного специального условия поля боя с исключениями
   * Перемешивает массив условий алгоритмом Фишера-Йетса и берет первое значение,
   * но если оно входит в список исключений, повторяет выбор до тех пор,
   * пока не выпадет разрешенное условие
   * @param exclusions Массив условий, которые нужно исключить
   * @returns Выбранное условие поля боя (не входящее в список исключений)
   */
  private selectBattlefieldConditionWithExclusions(exclusions: string[]): string {
    let condition: string;
    
    // Повторяем выбор до тех пор, пока не выпадет разрешенное условие
    do {
      // Перемешиваем массив условий алгоритмом Фишера-Йетса
      const shuffledConditions = this.fisherYatesShuffle(this.battlefieldConditions);
      
      // Берем первое значение из перемешанного массива
      condition = shuffledConditions[0];
    } while (exclusions.includes(condition));
    
    return condition;
  }

  /**
   * Бросок одного шестигранного кубика (d6)
   * Перемешивает массив [1,2,3,4,5,6] алгоритмом Фишера-Йетса и берет первое значение
   * @returns Результат броска (от 1 до 6)
   */
  private rollD6(): number {
    // Создаем массив чисел от 1 до 6
    const dice = [1, 2, 3, 4, 5, 6];
    
    // Перемешиваем алгоритмом Фишера-Йетса
    const shuffled = this.fisherYatesShuffle(dice);
    
    // Берем первое значение
    return shuffled[0];
  }

  /**
   * Бросок двух шестигранных кубиков (2d6)
   * Бросает два кубика независимо и возвращает их сумму
   * @returns Сумма двух бросков (от 2 до 12)
   */
  private roll2D6(): number {
    // Бросаем первый кубик
    const firstDie = this.rollD6();
    
    // Бросаем второй кубик
    const secondDie = this.rollD6();
    
    // Складываем результаты
    return firstDie + secondDie;
  }

  /**
   * Определение уровня экстремальной температуры (для условий с *)
   * Бросает 1d6 и определяет уровень: 1-3 = 1, 4-5 = 2, 6 = 3
   * @returns Уровень температуры (1, 2 или 3)
   */
  private determineExtremeTemperatureLevel(): number {
    const roll = this.rollD6();
    
    if (roll >= 1 && roll <= 3) {
      return 1;
    } else if (roll >= 4 && roll <= 5) {
      return 2;
    } else { // roll === 6
      return 3;
    }
  }

  /**
   * Определение уровня гравитации (для условий с ***)
   * Бросает 1d6 и определяет уровень гравитации
   * @returns Уровень гравитации (0.8, 1.2, 1.3, 1.4, 1.5 или 2.0)
   */
  private determineGravityLevel(): number {
    const roll = this.rollD6();
    
    const gravityLevels: Record<number, number> = {
      1: 0.8,
      2: 1.2,
      3: 1.3,
      4: 1.4,
      5: 1.5,
      6: 2.0,
    };
    
    return gravityLevels[roll] || 1.0;
  }

  /**
   * Обработка погодного условия с учетом специальных символов
   * Если условие содержит *, определяет уровень температуры
   * Если условие содержит ***, определяет уровень гравитации
   * Убирает звездочки из названия в результате
   * @param condition Базовое условие из таблицы
   * @returns Обработанное условие с дополнительной информацией (без звездочек)
   */
  private processWeatherCondition(condition: string): string {
    // Проверка на пустое условие или undefined/null
    if (!condition || typeof condition !== 'string' || condition.trim() === '') {
      return '';
    }

    if (condition.includes('***')) {
      // Обработка Gravity***
      const gravityLevel = this.determineGravityLevel();
      // Убираем все звездочки из названия
      const baseName = condition.replace(/\*/g, '').trim();
      return `${baseName} (${gravityLevel})`;
    } else if (condition.includes('*')) {
      // Обработка Extreme Cold* или Extreme Heat*
      const temperatureLevel = this.determineExtremeTemperatureLevel();
      // Убираем все звездочки из названия и добавляем уровень
      const baseName = condition.replace(/\*/g, '').trim();
      return `${baseName} (Level ${temperatureLevel})`;
    }
    
    // Обычное условие без специальных символов
    return condition.trim();
  }

  /**
   * Получение одного погодного условия по сумме броска
   * Рекурсивно обрабатывает случай суммы 7 (бросает еще раз до получения реального условия)
   * Обрабатывает специальные символы (* и ***) для определения уровней
   * @param sum Сумма броска 2d6
   * @returns Одно погодное условие (строка) с обработанными уровнями
   */
  private getSingleWeatherCondition(sum: number): string {
    if (sum === 7) {
      // Особый случай: если выпало 7, бросаем еще раз
      // Рекурсивно обрабатываем, пока не получим реальное условие
      const newSum = this.roll2D6();
      return this.getSingleWeatherCondition(newSum);
    } else {
      // Обычный случай: возвращаем условие для данной суммы
      const baseCondition = this.weatherConditions[sum];
      
      // Проверяем, что условие существует
      if (!baseCondition) {
        return '';
      }
      
      // Обрабатываем специальные символы (* и ***)
      return this.processWeatherCondition(baseCondition);
    }
  }

  /**
   * Определение погодных условий на основе суммы двух бросков d6
   * Если выпадает 7, бросает дважды и применяет оба результата
   * Всегда возвращает ровно два условия при сумме 7
   * @returns Массив погодных условий (один элемент, или два при сумме 7)
   */
  private determineWeatherConditions(): string[] {
    const sum = this.roll2D6();
    const conditions: string[] = [];

    if (sum === 7) {
      // Особый случай: бросаем дважды и получаем ровно два условия
      const firstCondition = this.getSingleWeatherCondition(this.roll2D6());
      const secondCondition = this.getSingleWeatherCondition(this.roll2D6());
      
      // Добавляем только непустые условия
      if (firstCondition && typeof firstCondition === 'string' && firstCondition.trim() !== '') {
        conditions.push(firstCondition);
      }
      if (secondCondition && typeof secondCondition === 'string' && secondCondition.trim() !== '') {
        conditions.push(secondCondition);
      }
    } else {
      // Обычный случай: одно условие
      const baseCondition = this.weatherConditions[sum];
      if (baseCondition) {
        // Обрабатываем специальные символы (* и ***)
        const processedCondition = this.processWeatherCondition(baseCondition);
        // Добавляем только непустое условие
        if (processedCondition && typeof processedCondition === 'string' && processedCondition.trim() !== '') {
          conditions.push(processedCondition);
        }
      }
    }

    return conditions;
  }

  /**
   * Генерация случайного кода миссии
   * @param type Тип миссии для префикса кода
   * @returns Уникальный код миссии
   */
  generateCode(type: string): string {
    const prefix = type === 'ALPHA_STRIKE' ? 'AS' : 'BT';
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${prefix}-${randomNumber.toString().padStart(3, '0')}`;
  }

  /**
   * Генерация миссии на основе переданных параметров
   * @param dto Параметры генерации
   * @returns Сгенерированная миссия
   */
  async generate(dto: GenerateMissionDto): Promise<GeneratedMissionDto> {
    // Выполняем функцию "чет-нечет"
    const isEven = this.isEven();

    // Выбираем миссию из соответствующего блока
    const { blockMessage, selectedMission } = this.selectMissionFromBlock(isEven);

    // Миссии, для которых запрещено условие "Random Duration"
    const missionsWithoutRandomDuration = ['Ambush', 'Annihilation', 'Breakthrough'];

    // Выбираем специальное условие поля боя
    // Если миссия входит в список исключений, используем метод с исключениями
    const battlefieldCondition = missionsWithoutRandomDuration.includes(selectedMission)
      ? this.selectBattlefieldConditionWithExclusions(['Random Duration'])
      : this.selectBattlefieldCondition();

    // Определяем погодные условия
    // Погодные условия генерируются только если условие поля боя = "Battlefield Conditions"
    const weatherConditions = battlefieldCondition === 'Battlefield Conditions'
      ? this.determineWeatherConditions()
      : ['НЕТ'];

    // Формируем название миссии
    const title = selectedMission;

    const generatedMission: GeneratedMissionDto = {
      code: this.generateCode(dto.type || 'CLASSIC'),
      title,
      description: undefined, // TODO: генерация описания
      objectives: [], // TODO: генерация целей
      type: dto.type || 'CLASSIC', // TODO: случайный выбор если не указан
      difficulty: dto.difficulty || 'MEDIUM', // TODO: случайный выбор если не указан
      cost: 0, // TODO: расчет стоимости
      reward: undefined, // TODO: генерация наград
      deploymentUrl: undefined, // TODO: генерация схемы
      source: undefined, // TODO: источник
      generatedAt: new Date(),
      isEven, // Результат функции чет-нечет
      blockMessage, // Сообщение о блоке ("первый блок" или "второй блок")
      battlefieldCondition, // Специальное условие поля боя
      weatherConditions, // Погодные условия (массив, так как при сумме 7 может быть два)
    };

    return generatedMission;
  }
}

