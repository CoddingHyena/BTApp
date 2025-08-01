import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMechDto } from './dto/create-mech.dto';
import { UpdateMechDto } from './dto/update-mech.dto';
import { Mech } from '@prisma/client';

@Injectable()
export class MechService {
  constructor(private prisma: PrismaService) {}

  async create(createMechDto: CreateMechDto): Promise<Mech> {
    return this.prisma.mech.create({
      data: createMechDto,
    });
  }

  async findAll(): Promise<Mech[]> {
    return this.prisma.mech.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Mech> {
    const mech = await this.prisma.mech.findUnique({
      where: { id },
    });

    if (!mech) {
      throw new NotFoundException(`Mech with ID ${id} not found`);
    }

    return mech;
  }

  async findByDbId(dbId: number): Promise<Mech> {
    const mech = await this.prisma.mech.findUnique({
      where: { dbId },
    });

    if (!mech) {
      throw new NotFoundException(`Mech with dbId ${dbId} not found`);
    }

    return mech;
  }

  async update(id: string, updateMechDto: UpdateMechDto): Promise<Mech> {
    await this.findOne(id); // Проверяем существование

    return this.prisma.mech.update({
      where: { id },
      data: updateMechDto,
    });
  }

  async remove(id: string): Promise<Mech> {
    await this.findOne(id); // Проверяем существование

    return this.prisma.mech.delete({
      where: { id },
    });
  }
}
