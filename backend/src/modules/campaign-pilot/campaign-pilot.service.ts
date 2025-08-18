import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignPilotDto } from './dto/create-campaign-pilot.dto';
import { UpdateCampaignPilotDto } from './dto/update-campaign-pilot.dto';
import { CampaignPilot, PilotStatus } from '@prisma/client';
import { 
  generateCompletePilot, 
  generateCompletePilotWithGender,
  generateCompletePilotWithMixedCultures,
  generateCompletePilotWithMixedCulturesAndGender,
  generateClanPilot,
  generateClanPilotWithGender,
  generateMixedRulesPilot,
  generateMixedRulesPilotWithGender,
  regeneratePilot,
  regeneratePilotName,
  validateGenderNameCombination,
  getGenderFromName
} from './examples/names';
import { 
  selectTwoRandomCultures, 
  mergeCultureWeights, 
  normalizeCultureWeights,
  CultureWeights 
} from './utils/culture-utils';

@Injectable()
export class CampaignPilotService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCampaignPilotDto: CreateCampaignPilotDto): Promise<CampaignPilot> {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignPilotDto.campaignId }
    });
    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    // Проверяем существование фракции
    const faction = await this.prisma.faction.findUnique({
      where: { id: createCampaignPilotDto.factionId }
    });
    if (!faction) {
      throw new NotFoundException('Фракция не найдена');
    }

    // Проверяем уникальность полного имени пилота в кампании у данной фракции
    const existingPilotByName = await this.prisma.campaignPilot.findFirst({
      where: {
        campaignId: createCampaignPilotDto.campaignId,
        factionId: createCampaignPilotDto.factionId,
        firstName: createCampaignPilotDto.firstName,
        lastName: createCampaignPilotDto.lastName
      }
    });
    if (existingPilotByName) {
      throw new NotFoundException('Пилот с таким именем и фамилией уже существует у данной фракции в кампании');
    }

    // Проверяем уникальность позывного в кампании у данной фракции
    const existingPilotByCallsign = await this.prisma.campaignPilot.findFirst({
      where: {
        campaignId: createCampaignPilotDto.campaignId,
        factionId: createCampaignPilotDto.factionId,
        callsign: createCampaignPilotDto.callsign
      }
    });
    if (existingPilotByCallsign) {
      throw new NotFoundException('Пилот с таким позывным уже существует у данной фракции в кампании');
    }

    return this.prisma.campaignPilot.create({
      data: createCampaignPilotDto,
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async findAll(): Promise<CampaignPilot[]> {
    return this.prisma.campaignPilot.findMany({
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async findByCampaign(campaignId: string): Promise<CampaignPilot[]> {
    return this.prisma.campaignPilot.findMany({
      where: { campaignId },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async findByFaction(campaignId: string, factionId: number): Promise<CampaignPilot[]> {
    return this.prisma.campaignPilot.findMany({
      where: {
        campaignId,
        factionId
      },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async findAvailablePilots(campaignId: string, factionId: number): Promise<CampaignPilot[]> {
    return this.prisma.campaignPilot.findMany({
      where: {
        campaignId,
        factionId,
        status: 'ACTIVE',
        units: {
          none: {} // Пилоты без назначенных юнитов
        }
      },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async findOne(id: string): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    return pilot;
  }

  async update(id: string, updateCampaignPilotDto: UpdateCampaignPilotDto): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    // Проверяем уникальность позывного при обновлении (если позывной изменяется)
    if (updateCampaignPilotDto.callsign && updateCampaignPilotDto.callsign !== pilot.callsign) {
      const existingPilotByCallsign = await this.prisma.campaignPilot.findFirst({
        where: {
          campaignId: pilot.campaignId,
          factionId: pilot.factionId,
          callsign: updateCampaignPilotDto.callsign,
          id: { not: id } // Исключаем текущего пилота
        }
      });
      if (existingPilotByCallsign) {
        throw new NotFoundException('Пилот с таким позывным уже существует у данной фракции в кампании');
      }
    }

    return this.prisma.campaignPilot.update({
      where: { id },
      data: updateCampaignPilotDto,
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async remove(id: string): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    // Проверяем, не назначен ли пилот на юнит
    const assignedUnits = await this.prisma.campaignUnit.findMany({
      where: { pilotId: id }
    });

    if (assignedUnits.length > 0) {
      throw new NotFoundException('Нельзя удалить пилота, назначенного на юнит. Сначала снимите его с юнита.');
    }

    return this.prisma.campaignPilot.delete({
      where: { id },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async updateStatus(id: string, status: PilotStatus): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    return this.prisma.campaignPilot.update({
      where: { id },
      data: { status },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async addExperience(id: string, experience: number): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    return this.prisma.campaignPilot.update({
      where: { id },
      data: {
        experience: {
          increment: experience
        }
      },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });
  }

  async assignToUnit(pilotId: string, unitId: string): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id: pilotId }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    const unit = await this.prisma.campaignUnit.findUnique({
      where: { id: unitId }
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    // Проверяем, что пилот и юнит принадлежат одной фракции в одной кампании
    if (pilot.campaignId !== unit.campaignId || pilot.factionId !== unit.factionId) {
      throw new NotFoundException('Пилот и юнит должны принадлежать одной фракции в одной кампании');
    }

    // Проверяем, что пилот активен
    if (pilot.status !== 'ACTIVE') {
      throw new NotFoundException('Можно назначить только активного пилота');
    }

    // Снимаем пилота с текущего юнита, если он назначен
    await this.prisma.campaignUnit.updateMany({
      where: { pilotId },
      data: { pilotId: null }
    });

    // Назначаем пилота на новый юнит
    await this.prisma.campaignUnit.update({
      where: { id: unitId },
      data: { pilotId }
    });

    const updatedPilot = await this.prisma.campaignPilot.findUnique({
      where: { id: pilotId },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });

    if (!updatedPilot) {
      throw new NotFoundException('Пилот не найден после назначения');
    }

    return updatedPilot;
  }

  async removeFromUnit(pilotId: string): Promise<CampaignPilot> {
    const pilot = await this.prisma.campaignPilot.findUnique({
      where: { id: pilotId }
    });

    if (!pilot) {
      throw new NotFoundException('Пилот не найден');
    }

    // Снимаем пилота со всех юнитов
    await this.prisma.campaignUnit.updateMany({
      where: { pilotId },
      data: { pilotId: null }
    });

    const updatedPilot = await this.prisma.campaignPilot.findUnique({
      where: { id: pilotId },
      include: {
        campaign: true,
        faction: true,
        units: true
      }
    });

    if (!updatedPilot) {
      throw new NotFoundException('Пилот не найден после снятия с юнита');
    }

    return updatedPilot;
  }

  // Новые методы для работы с культурой фракций

  /**
   * Получает культуру фракции с учетом иерархии
   * Если у фракции нет поля culture, поднимается вверх по иерархии
   */
  async getFactionCulture(factionId: number): Promise<string> {
    const faction = await this.prisma.faction.findUnique({
      where: { id: factionId },
      include: { 
        parentFaction: true
      }
    });

    if (!faction) {
      throw new NotFoundException('Фракция не найдена');
    }

    // Рекурсивно ищем корневую фракцию с установленной культурой
    return this.findRootFactionCulture(faction);
  }

  /**
   * Рекурсивно находит культуру в иерархии фракций
   */
  private findRootFactionCulture(faction: any): string {
    // Если у текущей фракции есть основная культура, возвращаем её
    if (faction.culture) {
      return faction.culture;
    }

    // Если есть родитель, поднимаемся вверх
    if (faction.parentFaction) {
      return this.findRootFactionCulture(faction.parentFaction);
    }

    // Достигли корневой фракции без культуры, определяем по названию
    return this.determineCultureByName(faction.name);
  }

  /**
   * Получает веса культур фракции с учетом иерархии
   */
  async getFactionCultureWeights(factionId: number): Promise<CultureWeights> {
    if (!factionId || isNaN(factionId)) {
      throw new NotFoundException('factionId должен быть валидным числом');
    }

    const faction = await this.prisma.faction.findUnique({
      where: { id: factionId },
      include: { 
        parentFaction: true
      }
    });

    if (!faction) {
      throw new NotFoundException('Фракция не найдена');
    }

    // Собираем веса культур от всех родителей
    const weightsArray: (CultureWeights | null)[] = [];
    
    // Добавляем веса текущей фракции
    if (faction.cultures) {
      weightsArray.push(faction.cultures as CultureWeights);
    }
    
    // Добавляем веса родительских фракций (рекурсивно)
    let currentFaction = faction;
    while (currentFaction.parentFaction) {
      if (currentFaction.parentFaction.cultures) {
        weightsArray.push(currentFaction.parentFaction.cultures as CultureWeights);
      }
      
      // Получаем следующего родителя
      const parentFaction = await this.prisma.faction.findUnique({
        where: { id: currentFaction.parentFaction.id },
        include: { parentFaction: true }
      });
      
      if (!parentFaction) {
        break;
      }
      
      currentFaction = parentFaction;
    }
    
    // Объединяем все веса
    const mergedWeights = mergeCultureWeights(...weightsArray);
    
    // Если нет весов культур, создаем fallback на основе основной культуры
    if (Object.keys(mergedWeights).length === 0) {
      const fallbackCulture = this.findRootFactionCulture(faction);
      return { [fallbackCulture]: 1.0 };
    }
    
    return normalizeCultureWeights(mergedWeights);
  }

  /**
   * Определяет культуру по названию фракции (fallback метод)
   */
  private determineCultureByName(factionName: string): string {
    const factionLower = factionName.toLowerCase();
    
    if (factionLower.includes('steiner') || factionLower.includes('lyran')) {
      return 'GERMAN';
    } else if (factionLower.includes('davion') || factionLower.includes('federated')) {
      return 'ANGLO_SAXON';
    } else if (factionLower.includes('kurita') || factionLower.includes('draconis')) {
      return 'JAPANESE';
    } else if (factionLower.includes('liao') || factionLower.includes('capellan')) {
      return 'CHINESE';
    } else if (factionLower.includes('marik') || factionLower.includes('free worlds')) {
      return 'MEDITERRANEAN';
    } else if (factionLower.includes('rasalhague') || factionLower.includes('scandinavian')) {
      return 'SCANDINAVIAN';
    } else if (factionLower.includes('periphery') || factionLower.includes('bandit')) {
      return 'RUSSIAN';
    } else if (factionLower.includes('clan') || factionLower.includes('wolf')) {
      return 'CLAN';
    } else {
      return 'ANGLO_SAXON'; // По умолчанию
    }
  }

  // Обновленные методы для работы с генерацией пилотов

  async generatePilotData(factionId: number, gender?: 'male' | 'female') {
    if (!factionId || isNaN(factionId)) {
      throw new NotFoundException('factionId должен быть валидным числом');
    }

    const cultureWeights = await this.getFactionCultureWeights(factionId);
    const faction = await this.prisma.faction.findUnique({
      where: { id: factionId }
    });

    if (!faction) {
      throw new NotFoundException('Фракция не найдена');
    }

    // Проверяем, является ли фракция клановой
    const isClanFaction = faction.culture === 'CLAN' || 
                         (faction.cultures && Object.keys(faction.cultures as any).includes('CLAN'));

    // Проверяем, является ли фракция Rasalhague Dominion (смешанные правила)
    const isRasalhagueDominion = faction.name === 'Rasalhague Dominion';

    if (isRasalhagueDominion) {
      // Генерация пилота с смешанными правилами для Rasalhague Dominion
      const clanSettings = faction.clanSettings as any;
      const warriorNameChance = clanSettings?.warriorNameChance || 0.2;
      const callsignChance = clanSettings?.callsignChance || 0.15;
      const warriorNames = clanSettings?.warriorNames || [];
      
      // 40% скандинавские правила, 60% клановые правила
      const scandinavianChance = 0.4;
      const clanChance = 0.6;

      if (gender) {
        return generateMixedRulesPilotWithGender(
          faction.name,
          gender,
          scandinavianChance,
          clanChance,
          warriorNameChance,
          warriorNames,
          callsignChance
        );
      }
      
      return generateMixedRulesPilot(
        faction.name,
        scandinavianChance,
        clanChance,
        warriorNameChance,
        warriorNames,
        callsignChance
      );
    } else if (isClanFaction) {
      // Генерация кланового пилота
      const clanSettings = faction.clanSettings as any;
      const warriorNameChance = clanSettings?.warriorNameChance || 0.2;
      const callsignChance = clanSettings?.callsignChance || 0.15;
      const warriorNames = clanSettings?.warriorNames || [];

      // Выбираем случайную культуру для имени
      const firstNameCulture = Object.keys(cultureWeights)[Math.floor(Math.random() * Object.keys(cultureWeights).length)];

      if (gender) {
        return generateClanPilotWithGender(
          faction.name,
          firstNameCulture as any,
          gender,
          warriorNameChance,
          warriorNames,
          callsignChance
        );
      }
      
      return generateClanPilot(
        faction.name,
        firstNameCulture as any,
        warriorNameChance,
        warriorNames,
        callsignChance
      );
    } else {
      // Обычная генерация с смешанными культурами
      const { firstNameCulture, lastNameCulture } = selectTwoRandomCultures(cultureWeights);

      if (gender) {
        return generateCompletePilotWithMixedCulturesAndGender(
          faction.name, 
          firstNameCulture as any, 
          lastNameCulture as any, 
          gender
        );
      }
      
      return generateCompletePilotWithMixedCultures(
        faction.name, 
        firstNameCulture as any, 
        lastNameCulture as any
      );
    }
  }

  async regeneratePilotData(factionId: number, currentGender?: 'male' | 'female') {
    const culture = await this.getFactionCulture(factionId);
    const faction = await this.prisma.faction.findUnique({
      where: { id: factionId }
    });

    if (!faction) {
      throw new NotFoundException('Фракция не найдена');
    }

    if (currentGender) {
      return regeneratePilotName(faction.name, currentGender, culture as any);
    }
    return regeneratePilot(faction.name, culture as any);
  }

  async validatePilotName(firstName: string, lastName: string, gender: 'male' | 'female', factionId: number) {
    const culture = await this.getFactionCulture(factionId);
    return validateGenderNameCombination(firstName, lastName, gender, culture as any);
  }

  async getGenderFromName(firstName: string, factionId: number) {
    const culture = await this.getFactionCulture(factionId);
    return getGenderFromName(firstName, culture as any);
  }
}
