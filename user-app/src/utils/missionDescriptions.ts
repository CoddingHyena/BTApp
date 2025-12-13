import { missionDescriptions } from '@/data/missionDescriptions';

/**
 * Нормализация названия миссии для сравнения
 * Убирает лишние пробелы, приводит к нижнему регистру
 * @param name Название миссии
 * @returns Нормализованное название
 */
function normalizeMissionName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Получение описания миссии по названию
 * @param missionName Название миссии
 * @returns Описание миссии или "НЕТ ОПИСАНИЯ" если не найдено
 */
export function getMissionDescription(missionName: string): string {
  if (!missionName || typeof missionName !== 'string') {
    return 'НЕТ ОПИСАНИЯ';
  }

  // Нормализуем название для поиска
  const normalized = normalizeMissionName(missionName);

  // Ищем описание в объекте
  // Сначала пробуем точное совпадение (с учетом регистра)
  if (missionDescriptions[missionName]) {
    return missionDescriptions[missionName];
  }

  // Затем ищем с нормализацией
  for (const [key, value] of Object.entries(missionDescriptions)) {
    if (normalizeMissionName(key) === normalized) {
      return value;
    }
  }

  // Если не найдено
  return 'НЕТ ОПИСАНИЯ';
}

