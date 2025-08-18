import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignEconomyDto } from './dto/create-campaign-economy.dto';
import { UpdateCampaignEconomyDto } from './dto/update-campaign-economy.dto';
import { CampaignEconomy } from '@prisma/client';

@Injectable()
export class CampaignEconomyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCampaignEconomyDto: CreateCampaignEconomyDto): Promise<CampaignEconomy> {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignEconomyDto.campaignId }
    });
    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    // Проверяем существование игрока в кампании
    const player = await this.prisma.campaignPlayer.findUnique({
      where: {
        campaignId_playerId: {
          campaignId: createCampaignEconomyDto.campaignId,
          playerId: createCampaignEconomyDto.playerId
        }
      }
    });
    if (!player) {
      throw new NotFoundException('Игрок не найден в кампании');
    }

    return this.prisma.campaignEconomy.create({
      data: createCampaignEconomyDto,
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findAll(): Promise<CampaignEconomy[]> {
    return this.prisma.campaignEconomy.findMany({
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByCampaign(campaignId: string): Promise<CampaignEconomy[]> {
    return this.prisma.campaignEconomy.findMany({
      where: { campaignId },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByPlayer(campaignId: string, playerId: string): Promise<CampaignEconomy> {
    const economy = await this.prisma.campaignEconomy.findUnique({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      include: {
        campaign: true,
        player: true
      }
    });

    if (!economy) {
      throw new NotFoundException('Экономика игрока не найдена');
    }

    return economy;
  }

  async findOne(id: string): Promise<CampaignEconomy> {
    const economy = await this.prisma.campaignEconomy.findUnique({
      where: { id },
      include: {
        campaign: true,
        player: true
      }
    });

    if (!economy) {
      throw new NotFoundException('Экономика не найдена');
    }

    return economy;
  }

  async update(id: string, updateCampaignEconomyDto: UpdateCampaignEconomyDto): Promise<CampaignEconomy> {
    const economy = await this.prisma.campaignEconomy.findUnique({
      where: { id }
    });

    if (!economy) {
      throw new NotFoundException('Экономика не найдена');
    }

    return this.prisma.campaignEconomy.update({
      where: { id },
      data: updateCampaignEconomyDto,
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async remove(id: string): Promise<CampaignEconomy> {
    const economy = await this.prisma.campaignEconomy.findUnique({
      where: { id }
    });

    if (!economy) {
      throw new NotFoundException('Экономика не найдена');
    }

    return this.prisma.campaignEconomy.delete({
      where: { id },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async addFunds(campaignId: string, playerId: string, amount: number): Promise<CampaignEconomy> {
    return this.prisma.campaignEconomy.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        currentFunds: {
          increment: amount
        },
        totalIncome: {
          increment: amount
        }
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async deductFunds(campaignId: string, playerId: string, amount: number): Promise<CampaignEconomy> {
    return this.prisma.campaignEconomy.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        currentFunds: {
          decrement: amount
        },
        totalExpenses: {
          increment: amount
        }
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async addTransaction(campaignId: string, playerId: string, transaction: any): Promise<CampaignEconomy> {
    const economy = await this.prisma.campaignEconomy.findUnique({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      }
    });

    if (!economy) {
      throw new NotFoundException('Экономика игрока не найдена');
    }

    const transactions = economy.transactions as any[] || [];
    transactions.push({
      ...transaction,
      timestamp: new Date().toISOString()
    });

    return this.prisma.campaignEconomy.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        transactions
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }
} 