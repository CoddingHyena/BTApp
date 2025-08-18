import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignPlayerDto } from './dto/create-campaign-player.dto';
import { UpdateCampaignPlayerDto } from './dto/update-campaign-player.dto';
import { CampaignPlayer, PlayerStatus, PlayerRole } from '@prisma/client';

@Injectable()
export class CampaignPlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCampaignPlayerDto: CreateCampaignPlayerDto): Promise<CampaignPlayer> {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignPlayerDto.campaignId }
    });
    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    // Проверяем существование пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: createCampaignPlayerDto.playerId }
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем, не является ли пользователь уже участником кампании
    const existingPlayer = await this.prisma.campaignPlayer.findUnique({
      where: {
        campaignId_playerId: {
          campaignId: createCampaignPlayerDto.campaignId,
          playerId: createCampaignPlayerDto.playerId
        }
      }
    });
    if (existingPlayer) {
      throw new ConflictException('Пользователь уже является участником этой кампании');
    }

    return this.prisma.campaignPlayer.create({
      data: createCampaignPlayerDto,
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async findAll(): Promise<CampaignPlayer[]> {
    return this.prisma.campaignPlayer.findMany({
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async findByCampaign(campaignId: string): Promise<CampaignPlayer[]> {
    return this.prisma.campaignPlayer.findMany({
      where: { campaignId },
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async findByPlayer(playerId: string): Promise<CampaignPlayer[]> {
    return this.prisma.campaignPlayer.findMany({
      where: { playerId },
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async findOne(id: string): Promise<CampaignPlayer> {
    const campaignPlayer = await this.prisma.campaignPlayer.findUnique({
      where: { id },
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });

    if (!campaignPlayer) {
      throw new NotFoundException('Участник кампании не найден');
    }

    return campaignPlayer;
  }

  async update(id: string, updateCampaignPlayerDto: UpdateCampaignPlayerDto): Promise<CampaignPlayer> {
    const campaignPlayer = await this.prisma.campaignPlayer.findUnique({
      where: { id }
    });

    if (!campaignPlayer) {
      throw new NotFoundException('Участник кампании не найден');
    }

    return this.prisma.campaignPlayer.update({
      where: { id },
      data: updateCampaignPlayerDto,
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async remove(id: string): Promise<CampaignPlayer> {
    const campaignPlayer = await this.prisma.campaignPlayer.findUnique({
      where: { id }
    });

    if (!campaignPlayer) {
      throw new NotFoundException('Участник кампании не найден');
    }

    return this.prisma.campaignPlayer.delete({
      where: { id },
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async updateStatus(id: string, status: PlayerStatus): Promise<CampaignPlayer> {
    return this.prisma.campaignPlayer.update({
      where: { id },
      data: { status },
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }

  async updateRole(id: string, role: PlayerRole): Promise<CampaignPlayer> {
    return this.prisma.campaignPlayer.update({
      where: { id },
      data: { role },
      include: {
        player: true,
        faction: true,
        campaign: true
      }
    });
  }


} 