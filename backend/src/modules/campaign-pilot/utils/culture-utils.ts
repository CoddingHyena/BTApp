import { CultureKey } from '../examples/names';

export interface CultureWeights {
  [key: string]: number;
}

/**
 * Выбирает случайную культуру на основе весов
 */
export function selectRandomCulture(weights: CultureWeights): string {
  const cultures = Object.keys(weights);
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  let random = Math.random() * totalWeight;
  
  for (const culture of cultures) {
    random -= weights[culture];
    if (random <= 0) {
      return culture;
    }
  }
  
  // Fallback на первую культуру
  return cultures[0] || 'ANGLO_SAXON';
}

/**
 * Выбирает две случайные культуры (для имени и фамилии)
 */
export function selectTwoRandomCultures(weights: CultureWeights): { firstNameCulture: string; lastNameCulture: string } {
  const firstNameCulture = selectRandomCulture(weights);
  const lastNameCulture = selectRandomCulture(weights);
  
  return { firstNameCulture, lastNameCulture };
}

/**
 * Объединяет веса культур от родительских фракций
 */
export function mergeCultureWeights(...weightsArray: (CultureWeights | null)[]): CultureWeights {
  const merged: CultureWeights = {};
  
  for (const weights of weightsArray) {
    if (weights) {
      for (const [culture, weight] of Object.entries(weights)) {
        if (merged[culture]) {
          merged[culture] += weight;
        } else {
          merged[culture] = weight;
        }
      }
    }
  }
  
  return merged;
}

/**
 * Нормализует веса культур (сумма = 1.0)
 */
export function normalizeCultureWeights(weights: CultureWeights): CultureWeights {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  if (totalWeight === 0) {
    return weights;
  }
  
  const normalized: CultureWeights = {};
  for (const [culture, weight] of Object.entries(weights)) {
    normalized[culture] = weight / totalWeight;
  }
  
  return normalized;
}
