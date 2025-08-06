import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { FactionService } from './faction.service';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';
import { Faction } from '@prisma/client';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('factions')
export class FactionController {
  private readonly logger = new Logger(FactionController.name);
  
  constructor(private readonly factionService: FactionService) {}

  @Get()
  async findAll(): Promise<Faction[]> {
    return this.factionService.findAll();
  }

  @Get('active')
  async findActive(): Promise<Faction[]> {
    return this.factionService.findActive();
  }

  @Get('major')
  async findMajor(): Promise<Faction[]> {
    return this.factionService.findMajor();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Faction> {
    return this.factionService.findOne(+id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Faction> {
    return this.factionService.findByCode(code);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createFactionDto: CreateFactionDto): Promise<Faction> {
    return this.factionService.create(createFactionDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateFactionDto: UpdateFactionDto,
  ): Promise<Faction> {
    this.logger.log(`Updating faction with ID: ${id}`);
    return this.factionService.update(+id, updateFactionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string): Promise<Faction> {
    return this.factionService.remove(+id);
  }
}