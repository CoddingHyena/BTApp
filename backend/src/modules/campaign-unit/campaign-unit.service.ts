import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignUnitDto } from './dto/create-campaign-unit.dto';
import { UpdateCampaignUnitDto } from './dto/update-campaign-unit.dto';
import { CampaignUnit, UnitStatus } from '@prisma/client';

@Injectable()
export class CampaignUnitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCampaignUnitDto: CreateCampaignUnitDto): Promise<CampaignUnit> {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignUnitDto.campaignId }
    });
    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    // Проверяем существование фракции
    const faction = await this.prisma.faction.findUnique({
      where: { id: createCampaignUnitDto.factionId }
    });
    if (!faction) {
      throw new NotFoundException('Фракция не найдена');
    }

    // Проверяем уникальность имени юнита в кампании у данной фракции
    const existingUnit = await this.prisma.campaignUnit.findFirst({
      where: {
        campaignId: createCampaignUnitDto.campaignId,
        factionId: createCampaignUnitDto.factionId,
        name: createCampaignUnitDto.name
      }
    });
    if (existingUnit) {
      throw new NotFoundException('Юнит с таким именем уже существует у данной фракции в кампании');
    }

    return this.prisma.campaignUnit.create({
      data: createCampaignUnitDto,
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async findAll(): Promise<CampaignUnit[]> {
    return this.prisma.campaignUnit.findMany({
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async findByCampaign(campaignId: string): Promise<CampaignUnit[]> {
    return this.prisma.campaignUnit.findMany({
      where: { campaignId },
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async findByFaction(campaignId: string, factionId: number): Promise<CampaignUnit[]> {
    return this.prisma.campaignUnit.findMany({
      where: {
        campaignId,
        factionId
      },
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async findOne(id: string): Promise<CampaignUnit> {
    const unit = await this.prisma.campaignUnit.findUnique({
      where: { id },
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    return unit;
  }

  async update(id: string, updateCampaignUnitDto: UpdateCampaignUnitDto): Promise<CampaignUnit> {
    const unit = await this.prisma.campaignUnit.findUnique({
      where: { id }
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    return this.prisma.campaignUnit.update({
      where: { id },
      data: updateCampaignUnitDto,
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async remove(id: string): Promise<CampaignUnit> {
    const unit = await this.prisma.campaignUnit.findUnique({
      where: { id }
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    return this.prisma.campaignUnit.delete({
      where: { id },
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async updateStatus(id: string, status: UnitStatus): Promise<CampaignUnit> {
    const unit = await this.prisma.campaignUnit.findUnique({
      where: { id }
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    return this.prisma.campaignUnit.update({
      where: { id },
      data: { status },
      include: {
        campaign: true,
        faction: true,
        pilot: true
      }
    });
  }

  async getUnitStatistics(id: string): Promise<any> {
    const unit = await this.prisma.campaignUnit.findUnique({
      where: { id },
      include: {}
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    return {
      unit,
      statistics: {
        // Статистика юнита (без поля experience)
      }
    };
  }
} 