import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateRawMechDto } from './dto/update-raw-mech.dto';
import { ValidateRawMechDto } from './dto/validate-raw-mech.dto';
import { RawMech, Mech } from '@prisma/client';

@Injectable()
export class RawMechService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<RawMech[]> {
    return this.prisma.rawMech.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findValidated(): Promise<RawMech[]> {
    return this.prisma.rawMech.findMany({
      where: { validated: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(): Promise<RawMech[]> {
    return this.prisma.rawMech.findMany({
      where: { validated: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<RawMech> {
    const rawMech = await this.prisma.rawMech.findUnique({
      where: { id },
    });

    if (!rawMech) {
      throw new NotFoundException(`RawMech with ID ${id} not found`);
    }

    return rawMech;
  }

  async update(id: string, updateRawMechDto: UpdateRawMechDto): Promise<RawMech> {
    await this.findOne(id); // Проверяем существование

    return this.prisma.rawMech.update({
      where: { id },
      data: updateRawMechDto,
    });
  }

  async validate(id: string, validateRawMechDto: ValidateRawMechDto): Promise<{ rawMech: RawMech; mech?: Mech }> {
    const rawMech = await this.findOne(id);

    // Обновляем статус валидации
    const updatedRawMech = await this.prisma.rawMech.update({
      where: { id },
      data: { validated: validateRawMechDto.validated },
    });

    let mech: Mech | undefined;

    // Если мех валидирован, создаем запись в таблице Mech
    if (validateRawMechDto.validated) {
      mech = await this.createMechFromRawMech(rawMech);
    }

    return { rawMech: updatedRawMech, mech };
  }

  private async createMechFromRawMech(rawMech: RawMech): Promise<Mech> {
    // Проверяем, не существует ли уже Mech с таким dbId
    const existingMech = await this.prisma.mech.findUnique({
      where: { dbId: rawMech.dbId },
    });

    if (existingMech) {
      throw new Error(`Mech with dbId ${rawMech.dbId} already exists`);
    }

    // Создаем новую запись в таблице Mech
    return this.prisma.mech.create({
      data: {
        dbId: rawMech.dbId,
        name: rawMech.name,
        unitType: rawMech.unitType,
        technology: rawMech.technology,
        chassis: rawMech.chassis,
        era: rawMech.era,
        year: rawMech.year,
        rulesLevel: rawMech.rulesLevel,
        tonnage: rawMech.tonnage,
        battleValue: rawMech.battleValue,
        pointValue: rawMech.pointValue,
        cost: rawMech.cost,
        rating: rawMech.rating,
        designer: rawMech.designer,
        rawMechId: rawMech.id, // Связываем с исходными данными
      },
    });
  }

  async remove(id: string): Promise<RawMech> {
    await this.findOne(id); // Проверяем существование

    return this.prisma.rawMech.delete({
      where: { id },
    });
  }
}
