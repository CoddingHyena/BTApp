import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { Period } from '@prisma/client';

@Injectable()
export class PeriodService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Period[]> {
    return this.prisma.period.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActive(): Promise<Period[]> {
    return this.prisma.period.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number): Promise<Period> {
    const period = await this.prisma.period.findUnique({
      where: { id },
    });

    if (!period) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }

    return period;
  }

  async findByCode(code: string): Promise<Period> {
    const period = await this.prisma.period.findUnique({
      where: { code },
    });

    if (!period) {
      throw new NotFoundException(`Period with code ${code} not found`);
    }

    return period;
  }

  async create(createPeriodDto: CreatePeriodDto): Promise<Period> {
    return this.prisma.period.create({
      data: createPeriodDto,
    });
  }

  async update(id: number, updatePeriodDto: UpdatePeriodDto): Promise<Period> {
    try {
      return await this.prisma.period.update({
        where: { id },
        data: updatePeriodDto,
      });
    } catch (error) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<Period> {
    try {
      return await this.prisma.period.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }
  }
}