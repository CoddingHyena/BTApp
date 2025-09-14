import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BattleResult, BattleStatus, BattleSideRole, Prisma } from '@prisma/client';

@Injectable()
export class BattleService {
  constructor(private readonly prisma: PrismaService) {}

  async createBattle(data: { campaignId: string; nodeId: string; missionId: string; notes?: string; rules?: any }) {
    // Проверяем связные сущности
    const [campaign, node, mission] = await Promise.all([
      this.prisma.campaign.findUnique({ where: { id: data.campaignId } }),
      this.prisma.mapNode.findUnique({ where: { id: data.nodeId } }),
      this.prisma.mission.findUnique({ where: { id: data.missionId } }),
    ]);
    if (!campaign) throw new BadRequestException('Кампания не найдена');
    if (!node) throw new BadRequestException('Узел карты не найден');
    if (!mission) throw new BadRequestException('Миссия не найдена');

    return this.prisma.battle.create({
      data: {
        campaignId: data.campaignId,
        nodeId: data.nodeId,
        missionId: data.missionId,
        status: 'SCHEDULED' as BattleStatus,
        notes: data.notes,
        rules: data.rules ?? {},
      } as any,
    });
  }

  async addSide(battleId: string, factionId: number, role: BattleSideRole) {
    const battle = await this.prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Бой не найден');
    return this.prisma.battleSide.create({ data: { battleId, factionId, role } });
  }

  async addFormation(battleId: string, sideId: string, formationId: string) {
    const battle = await this.prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Бой не найден');
    const side = await this.prisma.battleSide.findUnique({ where: { id: sideId } });
    if (!side || side.battleId !== battleId) throw new BadRequestException('Сторона боя не найдена или не принадлежит бою');
    const formation = await this.prisma.combatFormation.findUnique({ where: { id: formationId } });
    if (!formation) throw new NotFoundException('Формация не найдена');
    // Доп. проверка: фракция формации совпадает со стороной
    if (formation.factionId !== side.factionId) throw new BadRequestException('Формация принадлежит другой фракции');
    return this.prisma.inBattle_CombatFormation.create({ data: { battleId, sideId, formationId } });
  }

  async setCommittedUnits(battleFormationId: string, campaignUnitIds: string[]) {
    const bf = await this.prisma.inBattle_CombatFormation.findUnique({ where: { id: battleFormationId }, include: { formation: true } });
    if (!bf) throw new NotFoundException('Запись формирования в бою не найдена');
    // Можно добавить валидацию: все юниты принадлежат formation
    return this.prisma.inBattle_CombatFormation.update({ where: { id: battleFormationId }, data: { committedUnits: campaignUnitIds } as any });
  }

  async setStatus(battleId: string, status: BattleStatus) {
    const battle = await this.prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Бой не найден');
    // Простейшие переходы статусов: SCHEDULED -> ACTIVE -> RESOLVED/CANCELLED
    return this.prisma.battle.update({ where: { id: battleId }, data: { status } });
  }

  async linkReport(battleId: string, reportId: string) {
    const [battle, report] = await Promise.all([
      this.prisma.battle.findUnique({ where: { id: battleId } }),
      this.prisma.battleReport.findUnique({ where: { id: reportId } }),
    ]);
    if (!battle) throw new NotFoundException('Бой не найден');
    if (!report) throw new NotFoundException('Отчёт не найден');
    return this.prisma.battleReport.update({ where: { id: reportId }, data: { battleId } });
  }

  async getBattle(id: string) {
    return this.prisma.battle.findUnique({ where: { id }, include: { sides: true, formations: true, reports: true } });
  }

  async listByCampaign(campaignId: string) {
    return this.prisma.battle.findMany({ where: { campaignId }, orderBy: { createdAt: 'desc' } });
  }

  async resolveBattle(battleId: string) {
    const battle = await this.prisma.battle.findUnique({ where: { id: battleId }, include: { sides: true } });
    if (!battle) throw new NotFoundException('Бой не найден');
    // Собираем верифицированные отчёты и определяем очки по фракциям
    const reports = await this.prisma.battleReport.findMany({
      where: { battleId, isVerified: true } as any,
    });
    // Найдём factionId автора каждого отчёта через CampaignPlayer
    const campaignPlayers = await this.prisma.campaignPlayer.findMany({
      where: { campaignId: battle.campaignId, playerId: { in: reports.map((r) => r.playerId) } },
      select: { playerId: true, factionId: true },
    });
    const playerToFaction = new Map<string, number | null>();
    for (const cp of campaignPlayers) playerToFaction.set(cp.playerId, cp.factionId ?? null);

    const factionPoints = new Map<number, number>();
    for (const r of reports) {
      const fId = playerToFaction.get(r.playerId);
      if (typeof fId !== 'number') continue;
      const pv = r.victoryPoints ?? 0;
      factionPoints.set(fId, (factionPoints.get(fId) ?? 0) + pv);
    }

    // Обновляем стороны: выставляем victoryPoints и outcome
    let maxPoints = -Infinity;
    const sidePoints: Array<{ id: string; factionId: number; points: number }> = [];
    for (const s of battle.sides) {
      const pts = factionPoints.get(s.factionId) ?? 0;
      sidePoints.push({ id: s.id, factionId: s.factionId, points: pts });
      if (pts > maxPoints) maxPoints = pts;
    }
    const topSides = sidePoints.filter((s) => s.points === maxPoints);
    const outcomeBySide: Record<string, BattleResult> = {};
    if (topSides.length <= 1) {
      for (const sp of sidePoints) {
        outcomeBySide[sp.id] = sp.points === maxPoints ? 'VICTORY' : 'DEFEAT';
      }
    } else {
      for (const sp of sidePoints) outcomeBySide[sp.id] = 'DRAW';
    }

    // Транзакция на обновление
    await this.prisma.$transaction(async (tx) => {
      for (const sp of sidePoints) {
        await tx.battleSide.update({ where: { id: sp.id }, data: { victoryPoints: sp.points, outcome: outcomeBySide[sp.id] } });
      }
      await tx.battle.update({ where: { id: battleId }, data: { status: 'RESOLVED', resolvedAt: new Date() } });
    });

    return this.getBattle(battleId);
  }

  async applyConsequences(battleId: string, updates: Array<{ campaignUnitId: string; status?: Prisma.CampaignUnitUpdateInput['status']; damageType?: Prisma.CampaignUnitUpdateInput['damageType']; repairCost?: number; repairTime?: number; isRepaired?: boolean }>) {
    const battle = await this.prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Бой не найден');
    if (battle.status !== 'RESOLVED') throw new BadRequestException('Последствия можно применять только к завершённому бою');
    if (!Array.isArray(updates) || updates.length === 0) return { updated: 0 };

    let cnt = 0;
    await this.prisma.$transaction(async (tx) => {
      for (const u of updates) {
        await tx.campaignUnit.update({
          where: { id: u.campaignUnitId },
          data: {
            status: u.status as any,
            damageType: u.damageType as any,
            repairCost: typeof u.repairCost === 'number' ? u.repairCost : undefined,
            repairTime: typeof u.repairTime === 'number' ? u.repairTime : undefined,
            isRepaired: typeof u.isRepaired === 'boolean' ? u.isRepaired : undefined,
          },
        });
        cnt++;
      }
    });
    return { updated: cnt };
  }
}


