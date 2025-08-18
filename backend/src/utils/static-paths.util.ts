import { join } from 'path';

// Константы для путей к статическим файлам
export const STATIC_PATHS = {
  PUBLIC: join(process.cwd(), 'public'),
  UPLOADS: join(process.cwd(), 'public', 'uploads'),
  PERIODS: {
    IMAGES: join(process.cwd(), 'public', 'uploads', 'periods', 'images'),
    BANNERS: join(process.cwd(), 'public', 'uploads', 'periods', 'banners'),
  },
  FACTIONS: {
    LOGOS: join(process.cwd(), 'public', 'uploads', 'factions', 'logos'),
    BANNERS: join(process.cwd(), 'public', 'uploads', 'factions', 'banners'),
  },
  GAMES: {
    ICONS: join(process.cwd(), 'public', 'uploads', 'games', 'icons'),
    BANNERS: join(process.cwd(), 'public', 'uploads', 'games', 'banners'),
  },
  MISSIONS: {
    IMAGES: join(process.cwd(), 'public', 'uploads', 'missions'),
  },
} as const;

// Утилиты для работы с путями
export class StaticPathUtil {
  /**
   * Получить URL для статического файла
   */
  static getPublicUrl(filePath: string): string {
    return `/uploads/${filePath}`;
  }

  /**
   * Получить полный URL для статического файла
   */
  static getFullUrl(filePath: string, baseUrl: string = 'http://localhost:3000'): string {
    return `${baseUrl}/uploads/${filePath}`;
  }

  /**
   * Получить путь к файлу периодов
   */
  static getPeriodImagePath(fileName: string): string {
    return `periods/images/${fileName}`;
  }

  /**
   * Получить путь к баннеру периодов
   */
  static getPeriodBannerPath(fileName: string): string {
    return `periods/banners/${fileName}`;
  }

  /**
   * Получить путь к логотипу фракции
   */
  static getFactionLogoPath(fileName: string): string {
    return `factions/logos/${fileName}`;
  }

  /**
   * Получить путь к баннеру фракции
   */
  static getFactionBannerPath(fileName: string): string {
    return `factions/banners/${fileName}`;
  }

  /**
   * Получить путь к иконке игры
   */
  static getGameIconPath(fileName: string): string {
    return `games/icons/${fileName}`;
  }

  /**
   * Получить путь к баннеру игры
   */
  static getGameBannerPath(fileName: string): string {
    return `games/banners/${fileName}`;
  }

  /**
   * Получить путь к изображению миссии
   */
  static getMissionImagePath(fileName: string): string {
    return `missions/${fileName}`;
  }
}
