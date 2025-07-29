import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto'
import { Mission, MissionDifficulty, MissionType } from '@prisma/client';

@Injectable()
export class MissionService {
  constructor(private prisma: PrismaService) {}

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    // Проверка на уникальность code
    const existing = await this.prisma.mission.findUnique({
      where: { code: createMissionDto.code },
    });
    if (existing) {
      throw new Error('Mission code must be unique');
    }

    return this.prisma.mission.create({
      data: createMissionDto,
    });
  }

  async findAll(params: {
    difficulty?: MissionDifficulty;
    type?: MissionType;
  }): Promise<Mission[]> {
    return this.prisma.mission.findMany({
      where: {
        difficulty: params.difficulty,
        type: params.type,
      },
    });
  }

  async findActive(): Promise<Mission[]> {
    return this.prisma.mission.findMany({
      where: { isOfficial: true },
    });
  }

  async findOne(id: string): Promise<Mission> {
    const mission = await this.prisma.mission.findUnique({
      where: { id },
    });
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    return mission;
  }

  async findByCode(code: string): Promise<Mission> {
    const mission = await this.prisma.mission.findUnique({
      where: { code },
    });
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    return mission;
  }

  async update(
    id: string,
    updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    return this.prisma.mission.update({
      where: { id },
      data: updateMissionDto,
    });
  }

  async remove(id: string): Promise<Mission> {
    return this.prisma.mission.delete({
      where: { id },
    });
  }
}