import { battlefieldConditions } from '@/data/battlefieldConditions';

/**
 * Нормализация названия условия поля боя для сравнения
 * Убирает лишние пробелы, приводит к нижнему регистру
 * @param name Название условия поля боя
 * @returns Нормализованное название
 */
function normalizeConditionName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Получение описания условия поля боя по названию
 * @param conditionName Название условия поля боя
 * @returns Описание условия поля боя или "НЕТ ОПИСАНИЯ" если не найдено
 */
export function getBattlefieldConditionDescription(conditionName: string): string {
  if (!conditionName || typeof conditionName !== 'string') {
    return 'НЕТ ОПИСАНИЯ';
  }

  // Нормализуем название для поиска
  const normalized = normalizeConditionName(conditionName);

  // Ищем описание в объекте
  // Сначала пробуем точное совпадение (с учетом регистра)
  if (battlefieldConditions[conditionName]) {
    return battlefieldConditions[conditionName];
  }

  // Затем ищем с нормализацией
  for (const [key, value] of Object.entries(battlefieldConditions)) {
    if (normalizeConditionName(key) === normalized) {
      return value;
    }
  }

  // Если не найдено
  return 'НЕТ ОПИСАНИЯ';
}

