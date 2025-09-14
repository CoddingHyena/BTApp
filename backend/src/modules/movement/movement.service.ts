import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MovementOrderType, MovementStatus } from '@prisma/client';

@Injectable()
export class MovementService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(formationId: string, pathNodeIds: string[], orderType: MovementOrderType = 'NORMAL' as MovementOrderType) {
    const formation = await this.prisma.combatFormation.findUnique({ where: { id: formationId }, include: { campaign: { include: { campaignMap: { include: { template: { include: { nodes: true, edges: true } } } } } } } });
    if (!formation) throw new NotFoundException('Формация не найдена');
    if (!formation.campaign.campaignMap) throw new BadRequestException('К кампании не привязана карта');
    // Блокировка движения, если формация в бою (кроме отступления)
    const activeBattle = await this.prisma.inBattle_CombatFormation.findFirst({ where: { formationId, battle: { status: { in: ['SCHEDULED', 'ACTIVE'] } } } as any });
    if (activeBattle && orderType !== 'RETREAT') throw new BadRequestException('Формация в бою: разрешён только приказ отступления');
    // Активный ордер?
    const active = await this.prisma.movementOrder.findFirst({ where: { formationId, status: { in: ['QUEUED', 'IN_PROGRESS'] } } as any });
    if (active) throw new BadRequestException('У формации уже есть активный ордер');
    // Валидация пути
    const nodes = new Map(formation.campaign.campaignMap.template.nodes.map((n) => [n.id, n]));
    const edges = formation.campaign.campaignMap.template.edges;
    if (!formation.curentPositionId || pathNodeIds.length === 0 || pathNodeIds[0] !== formation.curentPositionId) {
      throw new BadRequestException('Путь должен начинаться с текущей позиции формации');
    }
    for (let i = 0; i < pathNodeIds.length; i++) {
      if (!nodes.has(pathNodeIds[i])) throw new BadRequestException('Путь содержит недопустимый узел');
      if (i > 0) {
        const from = pathNodeIds[i - 1];
        const to = pathNodeIds[i];
        const exists = edges.some((e) => (e.fromNodeId === from && e.toNodeId === to) || (e.bidirectional && e.fromNodeId === to && e.toNodeId === from));
        if (!exists) throw new BadRequestException('Между узлами нет ребра');
      }
    }
    return this.prisma.movementOrder.create({
      data: {
        campaignId: formation.campaignId,
        formationId,
        pathNodeIds,
        status: 'QUEUED' as MovementStatus,
        orderType,
        currentEdgeIndex: 0,
        remainingCost: 0,
      } as any,
    });
  }

  async cancelOrder(orderId: string) {
    const order = await this.prisma.movementOrder.findUnique({ where: { id: orderId }, include: { formation: true } });
    if (!order) throw new NotFoundException('Ордер не найден');
    if (order.status === 'ARRIVED') throw new BadRequestException('Нельзя отменить завершённый ордер');
    // Фиксируем текущую позицию: формация остаётся в текущем узле (ничего не меняем, так как узел обновляется только при завершении ребра)
    return this.prisma.movementOrder.update({ where: { id: orderId }, data: { status: 'CANCELLED', canceledAt: new Date() } as any });
  }

  async advanceTurn(campaignId: string) {
    const campaignMap = await this.prisma.campaignMap.findUnique({ where: { campaignId }, include: { template: { include: { edges: true } } } });
    if (!campaignMap) throw new NotFoundException('Карта кампании не найдена');
    const edges = campaignMap.template.edges;
    const orders = await this.prisma.movementOrder.findMany({ where: { campaignId, status: { in: ['QUEUED', 'IN_PROGRESS'] } } as any, include: { formation: true } });
    const updated: any[] = [];
    for (const order of orders) {
      if (order.status === 'QUEUED') {
        // стартуем первый отрезок
        const from = (order.pathNodeIds as any)[0];
        const to = (order.pathNodeIds as any)[1];
        const edge = edges.find((e) => (e.fromNodeId === from && e.toNodeId === to) || (e.bidirectional && e.fromNodeId === to && e.toNodeId === from));
        if (!edge) throw new BadRequestException('Некорректный путь ордера');
        const started = await this.prisma.movementOrder.update({ where: { id: order.id }, data: { status: 'IN_PROGRESS', startedAt: new Date(), currentEdgeIndex: 0, remainingCost: edge.cost } as any });
        updated.push(started);
        continue;
      }
      // IN_PROGRESS
      if (order.remainingCost > 1) {
        const upd = await this.prisma.movementOrder.update({ where: { id: order.id }, data: { remainingCost: order.remainingCost - 1 } });
        updated.push(upd);
        continue;
      }
      // завершение ребра
      const fromIndex = order.currentEdgeIndex;
      const nextNode = (order.pathNodeIds as any)[fromIndex + 1];
      await this.prisma.combatFormation.update({ where: { id: order.formationId }, data: { curentPositionId: nextNode } });
      const stillHas = fromIndex + 2 < (order.pathNodeIds as any).length;
      if (stillHas) {
        const nextFrom = (order.pathNodeIds as any)[fromIndex + 1];
        const nextTo = (order.pathNodeIds as any)[fromIndex + 2];
        const edge = edges.find((e) => (e.fromNodeId === nextFrom && e.toNodeId === nextTo) || (e.bidirectional && e.fromNodeId === nextTo && e.toNodeId === nextFrom));
        if (!edge) throw new BadRequestException('Некорректный путь ордера');
        const upd = await this.prisma.movementOrder.update({ where: { id: order.id }, data: { currentEdgeIndex: fromIndex + 1, remainingCost: edge.cost } as any });
        updated.push(upd);
      } else {
        const done = await this.prisma.movementOrder.update({ where: { id: order.id }, data: { status: 'ARRIVED', completedAt: new Date(), remainingCost: 0 } as any });
        updated.push(done);
      }
    }
    return { updatedCount: updated.length };
  }
}


