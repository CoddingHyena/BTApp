import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { FactionService } from './faction.service';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';
import { Faction } from '@prisma/client';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Factions')
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

  // Роут по коду должен идти выше, чем роут по :id
  @Get('code/:code')
  @ApiOperation({ summary: 'Получить фракцию по коду' })
  @ApiParam({ name: 'code', type: String })
  async findByCode(@Param('code') code: string): Promise<Faction> {
    return this.factionService.findByCode(code);
  }

  @Get('top-level')
  @ApiOperation({ summary: 'Корневые фракции (без родителя)' })
  async findTopLevel(): Promise<Faction[]> {
    return this.factionService.findTopLevelFactions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить фракцию по ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: string): Promise<Faction> {
    return this.factionService.findOne(+id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Дочерние фракции' })
  @ApiParam({ name: 'id', type: Number })
  async findChildren(@Param('id') id: string): Promise<Faction[]> {
    return this.factionService.findChildFactions(+id);
  }

  @Get(':id/tree')
  @ApiOperation({ summary: 'Дерево фракции' })
  @ApiParam({ name: 'id', type: Number })
  async getTree(@Param('id') id: string): Promise<Faction> {
    return this.factionService.getFactionTree(+id);
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