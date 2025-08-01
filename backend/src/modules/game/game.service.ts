import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, GameCategory } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    return this.prisma.game.create({
      data: createGameDto,
    });
  }

  async findAll(): Promise<Game[]> {
    return this.prisma.game.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActive(): Promise<Game[]> {
    return this.prisma.game.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByCategory(category: GameCategory): Promise<Game[]> {
    return this.prisma.game.findMany({
      where: { 
        category,
        isActive: true 
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        factions: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(`Игра с ID ${id} не найдена`);
    }

    return game;
  }

  async findByName(name: string): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: { name },
      include: {
        factions: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(`Игра "${name}" не найдена`);
    }

    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    try {
      return await this.prisma.game.update({
        where: { id },
        data: updateGameDto,
      });
    } catch (error) {
      throw new NotFoundException(`Игра с ID ${id} не найдена`);
    }
  }

  async remove(id: string): Promise<Game> {
    try {
      return await this.prisma.game.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Игра с ID ${id} не найдена`);
    }
  }

  async getCategories(): Promise<GameCategory[]> {
    return Object.values(GameCategory);
  }
} 