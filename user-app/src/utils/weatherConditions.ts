import { weatherConditions } from '@/data/weatherConditions';

/**
 * Извлечение базового названия погодного условия из полного названия
 * Убирает уровни, скобки и другие дополнительные данные
 * Примеры:
 *   "Extreme Cold (Level 2)" -> "Extreme Cold"
 *   "Gravity (1.5)" -> "Gravity"
 *   "Wind" -> "Wind"
 * @param fullName Полное название условия (может содержать уровни в скобках)
 * @returns Базовое название условия
 */
function extractBaseWeatherName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  // Убираем все что в скобках (уровни, значения гравитации и т.д.)
  const withoutBrackets = fullName.replace(/\s*\([^)]*\)\s*/g, '').trim();
  
  return withoutBrackets;
}

/**
 * Нормализация названия погодного условия для сравнения
 * Убирает лишние пробелы, приводит к нужному формату
 * @param name Название условия
 * @returns Нормализованное название
 */
function normalizeWeatherName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Получение описания погодного условия по названию
 * @param weatherName Название погодного условия (может содержать уровни в скобках)
 * @returns Описание погодного условия или "НЕТ ОПИСАНИЯ" если не найдено
 */
export function getWeatherConditionDescription(weatherName: string): string {
  if (!weatherName || typeof weatherName !== 'string') {
    return 'НЕТ ОПИСАНИЯ';
  }

  // Извлекаем базовое название (без уровней)
  const baseName = extractBaseWeatherName(weatherName);
  
  if (!baseName) {
    return 'НЕТ ОПИСАНИЯ';
  }

  // Нормализуем для поиска
  const normalized = normalizeWeatherName(baseName);

  // Ищем описание в объекте
  // Сначала пробуем точное совпадение
  if (weatherConditions[baseName]) {
    return weatherConditions[baseName];
  }

  // Затем ищем с нормализацией
  for (const [key, value] of Object.entries(weatherConditions)) {
    if (normalizeWeatherName(key) === normalized) {
      return value;
    }
  }

  // Если не найдено
  return 'НЕТ ОПИСАНИЯ';
}

