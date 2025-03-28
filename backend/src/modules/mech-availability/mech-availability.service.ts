import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMechAvailabilityDto } from './dto/create-mech-availability.dto';
import { UpdateMechAvailabilityDto } from './dto/update-mech-availability.dto';
import { MechAvailability, Prisma } from '@prisma/client';

@Injectable()
export class MechAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(createMechAvailabilityDto: CreateMechAvailabilityDto): Promise<MechAvailability> {
    try {
      // Проверка существования меха
      const mech = await this.prisma.mech.findUnique({
        where: { id: createMechAvailabilityDto.mechId },
      });
      if (!mech) {
        throw new NotFoundException(`Mech with ID ${createMechAvailabilityDto.mechId} not found`);
      }

      // Проверка существования фракции
      const faction = await this.prisma.faction.findUnique({
        where: { id: createMechAvailabilityDto.factionId },
      });
      if (!faction) {
        throw new NotFoundException(`Faction with ID ${createMechAvailabilityDto.factionId} not found`);
      }

      // Проверка существования периода
      const period = await this.prisma.period.findUnique({
        where: { id: createMechAvailabilityDto.periodId },
      });
      if (!period) {
        throw new NotFoundException(`Period with ID ${createMechAvailabilityDto.periodId} not found`);
      }

      // Создание записи о доступности
      return await this.prisma.mechAvailability.create({
        data: createMechAvailabilityDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Обработка ошибки уникального ограничения
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Availability record for this mech, faction, and period combination already exists`,
          );
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<MechAvailability[]> {
    return this.prisma.mechAvailability.findMany({
      include: {
        mech: true,
        faction: true,
        period: true,
      },
    });
  }

  async findOne(id: string): Promise<MechAvailability> { // Изменен тип с number на string
    const availability = await this.prisma.mechAvailability.findUnique({
      where: { id },
      include: {
        mech: true,
        faction: true,
        period: true,
      },
    });

    if (!availability) {
      throw new NotFoundException(`Mech availability with ID ${id} not found`);
    }

    return availability;
  }

  async findByMech(mechId: string): Promise<MechAvailability[]> {
    return this.prisma.mechAvailability.findMany({
      where: { mechId },
      include: {
        faction: true,
        period: true,
      },
    });
  }

  async findByFaction(factionId: number): Promise<MechAvailability[]> {
    return this.prisma.mechAvailability.findMany({
      where: { factionId },
      include: {
        mech: true,
        period: true,
      },
    });
  }

  async findByPeriod(periodId: number): Promise<MechAvailability[]> {
    return this.prisma.mechAvailability.findMany({
      where: { periodId },
      include: {
        mech: true,
        faction: true,
      },
    });
  }

  async findByFactionAndPeriod(factionId: number, periodId: number): Promise<MechAvailability[]> {
    return this.prisma.mechAvailability.findMany({
      where: {
        factionId,
        periodId,
      },
      include: {
        mech: true,
      },
    });
  }

  async update(id: string, updateMechAvailabilityDto: UpdateMechAvailabilityDto): Promise<MechAvailability> { // Изменен тип с number на string
    try {
      return await this.prisma.mechAvailability.update({
        where: { id },
        data: updateMechAvailabilityDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Mech availability with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Availability record for this mech, faction, and period combination already exists`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<MechAvailability> { // Изменен тип с number на string
    try {
      return await this.prisma.mechAvailability.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Mech availability with ID ${id} not found`);
      }
      throw error;
    }
  }
}