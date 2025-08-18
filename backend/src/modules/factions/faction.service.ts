import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';
import { Faction } from '@prisma/client';

@Injectable()
export class FactionService {
  private readonly logger = new Logger(FactionService.name);
  
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Faction[]> {
    return this.prisma.faction.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findActive(): Promise<Faction[]> {
    return this.prisma.faction.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findMajor(): Promise<Faction[]> {
    return this.prisma.faction.findMany({
      where: { isMajor: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number): Promise<Faction> {
    const faction = await this.prisma.faction.findUnique({
      where: { id },
    });

    if (!faction) {
      throw new NotFoundException(`Faction with ID ${id} not found`);
    }

    return faction;
  }

  async findByCode(code: string): Promise<Faction> {
    const faction = await this.prisma.faction.findUnique({
      where: { code },
    });

    if (!faction) {
      throw new NotFoundException(`Faction with code ${code} not found`);
    }

    return faction;
  }

  async create(createFactionDto: CreateFactionDto): Promise<Faction> {
    // Проверяем существование родительской фракции, если указана
    if (createFactionDto.parentFactionId) {
      await this.validateParentFaction(createFactionDto.parentFactionId);
    }

    return this.prisma.faction.create({
      data: createFactionDto,
    });
  }

  async update(id: number, updateFactionDto: UpdateFactionDto): Promise<Faction> {
    try {
      this.logger.log(`Updating faction with ID: ${id}`);
      this.logger.log(`Update data:`, updateFactionDto);
      
      const updatedFaction = await this.prisma.faction.update({
        where: { id },
        data: updateFactionDto,
      });
      
      this.logger.log(`Faction updated successfully:`, {
        id: updatedFaction.id,
        name: updatedFaction.name,
        logoUrl: updatedFaction.logoUrl,
        bannerUrl: updatedFaction.bannerUrl
      });
      
      return updatedFaction;
    } catch (error) {
      this.logger.error(`Error updating faction with ID ${id}:`, error);
      throw new NotFoundException(`Faction with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<Faction> {
    try {
      return await this.prisma.faction.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Faction with ID ${id} not found`);
    }
  }

  async findTopLevelFactions(): Promise<Faction[]> {
    return this.prisma.faction.findMany({
      where: {
        parentFactionId: null,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findChildFactions(parentId: number): Promise<Faction[]> {
    return this.prisma.faction.findMany({
      where: {
        parentFactionId: parentId,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getFactionTree(id: number): Promise<Faction> {
    const faction = await this.prisma.faction.findUnique({
      where: { id },
    });

    if (!faction) {
      throw new NotFoundException(`Faction with ID ${id} not found`);
    }

    return faction;
  }

  async findRootFaction(factionId: number): Promise<Faction> {
    const faction = await this.findOne(factionId);
    
    const parentId = (faction as any).parentFactionId as number | null | undefined;
    if (!parentId) {
      return faction;
    }

    return this.findRootFaction(parentId);
  }

  private async validateParentFaction(parentFactionId: number): Promise<void> {
    const parentFaction = await this.prisma.faction.findUnique({
      where: { id: parentFactionId },
    });

    if (!parentFaction) {
      throw new BadRequestException(`Parent faction with ID ${parentFactionId} not found`);
    }

    if (!parentFaction.isActive) {
      throw new BadRequestException(`Parent faction with ID ${parentFactionId} is not active`);
    }
  }
}