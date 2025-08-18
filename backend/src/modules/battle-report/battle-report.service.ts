import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBattleReportDto } from './dto/create-battle-report.dto';
import { UpdateBattleReportDto } from './dto/update-battle-report.dto';
import { BattleReport, BattleResult } from '@prisma/client';

@Injectable()
export class BattleReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBattleReportDto: CreateBattleReportDto): Promise<BattleReport> {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createBattleReportDto.campaignId }
    });
    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    // Проверяем существование игрока в кампании
    const player = await this.prisma.campaignPlayer.findUnique({
      where: {
        campaignId_playerId: {
          campaignId: createBattleReportDto.campaignId,
          playerId: createBattleReportDto.playerId
        }
      }
    });
    if (!player) {
      throw new NotFoundException('Игрок не найден в кампании');
    }

    return this.prisma.battleReport.create({
      data: createBattleReportDto,
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findAll(): Promise<BattleReport[]> {
    return this.prisma.battleReport.findMany({
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByCampaign(campaignId: string): Promise<BattleReport[]> {
    return this.prisma.battleReport.findMany({
      where: { campaignId },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByPlayer(campaignId: string, playerId: string): Promise<BattleReport[]> {
    return this.prisma.battleReport.findMany({
      where: {
        campaignId,
        playerId
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findOne(id: string): Promise<BattleReport> {
    const battleReport = await this.prisma.battleReport.findUnique({
      where: { id },
      include: {
        campaign: true,
        player: true
      }
    });

    if (!battleReport) {
      throw new NotFoundException('Боевой отчет не найден');
    }

    return battleReport;
  }

  async update(id: string, updateBattleReportDto: UpdateBattleReportDto): Promise<BattleReport> {
    const battleReport = await this.prisma.battleReport.findUnique({
      where: { id }
    });

    if (!battleReport) {
      throw new NotFoundException('Боевой отчет не найден');
    }

    const updateData = { ...updateBattleReportDto };
    // Убираем преобразование battleDate, так как Prisma автоматически обработает строку

    return this.prisma.battleReport.update({
      where: { id },
      data: updateData,
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async remove(id: string): Promise<BattleReport> {
    const battleReport = await this.prisma.battleReport.findUnique({
      where: { id }
    });

    if (!battleReport) {
      throw new NotFoundException('Боевой отчет не найден');
    }

    return this.prisma.battleReport.delete({
      where: { id },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async verifyReport(id: string, verifiedBy: string): Promise<BattleReport> {
    const battleReport = await this.prisma.battleReport.findUnique({
      where: { id }
    });

    if (!battleReport) {
      throw new NotFoundException('Боевой отчет не найден');
    }

    return this.prisma.battleReport.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date()
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByResult(campaignId: string, result: BattleResult): Promise<BattleReport[]> {
    return this.prisma.battleReport.findMany({
      where: {
        campaignId,
        result
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async findByDateRange(campaignId: string, startDate: string, endDate: string): Promise<BattleReport[]> {
    return this.prisma.battleReport.findMany({
      where: {
        campaignId,
        battleDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        campaign: true,
        player: true
      }
    });
  }

  async getBattleStatistics(campaignId: string, playerId: string): Promise<any> {
    const reports = await this.prisma.battleReport.findMany({
      where: {
        campaignId,
        playerId
      }
    });

    const totalBattles = reports.length;
    const battlesWon = reports.filter(r => r.result === 'VICTORY').length;
    const battlesLost = reports.filter(r => r.result === 'DEFEAT').length;
    const battlesDrawn = reports.filter(r => r.result === 'DRAW').length;

    return {
      totalBattles,
      battlesWon,
      battlesLost,
      battlesDrawn,
      winRate: totalBattles > 0 ? (battlesWon / totalBattles) * 100 : 0
    };
  }
} 