import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignProgressDto } from './dto/create-campaign-progress.dto';
import { UpdateCampaignProgressDto } from './dto/update-campaign-progress.dto';
import { CampaignProgress } from '@prisma/client';

@Injectable()
export class CampaignProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCampaignProgressDto: CreateCampaignProgressDto): Promise<CampaignProgress> {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignProgressDto.campaignId }
    });
    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    // Проверяем существование игрока в кампании
    const player = await this.prisma.campaignPlayer.findUnique({
      where: {
        campaignId_playerId: {
          campaignId: createCampaignProgressDto.campaignId,
          playerId: createCampaignProgressDto.playerId
        }
      }
    });
    if (!player) {
      throw new NotFoundException('Игрок не найден в кампании');
    }

    return this.prisma.campaignProgress.create({
      data: createCampaignProgressDto,
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findAll(): Promise<CampaignProgress[]> {
    return this.prisma.campaignProgress.findMany({
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByCampaign(campaignId: string): Promise<CampaignProgress[]> {
    return this.prisma.campaignProgress.findMany({
      where: { campaignId },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByPlayer(campaignId: string, playerId: string): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
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

    if (!progress) {
      throw new NotFoundException('Прогресс игрока не найден');
    }

    return progress;
  }

  async findOne(id: string): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: { id },
      include: {
        campaign: true,
        player: true
      }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс не найден');
    }

    return progress;
  }

  async update(id: string, updateCampaignProgressDto: UpdateCampaignProgressDto): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: { id }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс не найден');
    }

    return this.prisma.campaignProgress.update({
      where: { id },
      data: updateCampaignProgressDto,
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async remove(id: string): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: { id }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс не найден');
    }

    return this.prisma.campaignProgress.delete({
      where: { id },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async addBattleWon(campaignId: string, playerId: string): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс игрока не найден');
    }

    return this.prisma.campaignProgress.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        battlesWon: {
          increment: 1
        },
        winStreak: {
          increment: 1
        },
        lossStreak: 0,
        lastBattleDate: new Date()
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async addBattleLost(campaignId: string, playerId: string): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс игрока не найден');
    }

    return this.prisma.campaignProgress.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        battlesLost: {
          increment: 1
        },
        lossStreak: {
          increment: 1
        },
        winStreak: 0,
        lastBattleDate: new Date()
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async addBattleDrawn(campaignId: string, playerId: string): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс игрока не найден');
    }

    return this.prisma.campaignProgress.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        battlesDrawn: {
          increment: 1
        },
        lastBattleDate: new Date()
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async updateRating(campaignId: string, playerId: string, newRating: number): Promise<CampaignProgress> {
    return this.prisma.campaignProgress.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        rating: newRating
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async addAchievement(campaignId: string, playerId: string, achievement: any): Promise<CampaignProgress> {
    const progress = await this.prisma.campaignProgress.findUnique({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      }
    });

    if (!progress) {
      throw new NotFoundException('Прогресс игрока не найден');
    }

    const achievements = progress.achievements as any[] || [];
    achievements.push({
      ...achievement,
      earnedAt: new Date().toISOString()
    });

    return this.prisma.campaignProgress.update({
      where: {
        campaignId_playerId: {
          campaignId,
          playerId
        }
      },
      data: {
        achievements
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }
} 