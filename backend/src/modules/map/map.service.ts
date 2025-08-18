import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) {}

  // MapTemplate CRUD
  createTemplate(data: any) {
    return this.prisma.mapTemplate.create({ data });
  }
  findTemplates() {
    return this.prisma.mapTemplate.findMany({ include: { nodes: true, edges: true } });
  }
  findTemplate(id: string) {
    return this.prisma.mapTemplate.findUnique({ where: { id }, include: { nodes: true, edges: true } });
  }
  updateTemplate(id: string, data: any) {
    return this.prisma.mapTemplate.update({ where: { id }, data });
  }
  removeTemplate(id: string) {
    return this.prisma.mapTemplate.delete({ where: { id } });
  }

  // Nodes
  createNode(data: any) {
    return this.prisma.mapNode.create({ data });
  }
  updateNode(id: string, data: any) {
    return this.prisma.mapNode.update({ where: { id }, data });
  }
  removeNode(id: string) {
    return this.prisma.mapNode.delete({ where: { id } });
  }

  // Edges
  createEdge(data: any) {
    return this.prisma.mapEdge.create({ data });
  }
  updateEdge(id: string, data: any) {
    return this.prisma.mapEdge.update({ where: { id }, data });
  }
  removeEdge(id: string) {
    return this.prisma.mapEdge.delete({ where: { id } });
  }

  // CampaignMap
  async bindCampaignMap(campaignId: string, templateId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Кампания не найдена');
    return this.prisma.campaignMap.upsert({
      where: { campaignId },
      create: { campaignId, templateId },
      update: { templateId },
    });
  }
  getCampaignMap(campaignId: string) {
    return this.prisma.campaignMap.findUnique({ where: { campaignId }, include: { template: { include: { nodes: true, edges: true } } } });
  }
}


