import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MechAvailabilityService } from './mech-availability.service';
import { CreateMechAvailabilityDto } from './dto/create-mech-availability.dto';
import { UpdateMechAvailabilityDto } from './dto/update-mech-availability.dto';
import { MechAvailability } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('mech-availability')
@Controller('mech-availability')
export class MechAvailabilityController {
  constructor(private readonly mechAvailabilityService: MechAvailabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mech availability record' })
  async create(@Body() createMechAvailabilityDto: CreateMechAvailabilityDto): Promise<MechAvailability> {
    return this.mechAvailabilityService.create(createMechAvailabilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mech availability records' })
  async findAll(): Promise<MechAvailability[]> {
    return this.mechAvailabilityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific mech availability record by ID' })
  @ApiParam({ name: 'id', description: 'Mech availability ID' })
  async findOne(@Param('id') id: string): Promise<MechAvailability> {
    return this.mechAvailabilityService.findOne(id); // ID теперь используется как строка без преобразования
  }

  @Get('mech/:mechId')
  @ApiOperation({ summary: 'Get all availability records for a specific mech' })
  @ApiParam({ name: 'mechId', description: 'Mech ID' })
  async findByMech(@Param('mechId') mechId: string): Promise<MechAvailability[]> {
    return this.mechAvailabilityService.findByMech(mechId);
  }

  @Get('faction/:factionId')
  @ApiOperation({ summary: 'Get all availability records for a specific faction' })
  @ApiParam({ name: 'factionId', description: 'Faction ID' })
  async findByFaction(@Param('factionId') factionId: string): Promise<MechAvailability[]> {
    return this.mechAvailabilityService.findByFaction(+factionId); // Преобразуем в число, так как factionId в БД числовой
  }

  @Get('period/:periodId')
  @ApiOperation({ summary: 'Get all availability records for a specific period' })
  @ApiParam({ name: 'periodId', description: 'Period ID' })
  async findByPeriod(@Param('periodId') periodId: string): Promise<MechAvailability[]> {
    return this.mechAvailabilityService.findByPeriod(+periodId); // Преобразуем в число, так как periodId в БД числовой
  }

  @Get('filter')
  @ApiOperation({ summary: 'Get availability records filtered by faction and period' })
  @ApiQuery({ name: 'factionId', description: 'Faction ID', required: true })
  @ApiQuery({ name: 'periodId', description: 'Period ID', required: true })
  async findByFactionAndPeriod(
    @Query('factionId') factionId: string, 
    @Query('periodId') periodId: string
  ): Promise<MechAvailability[]> {
    return this.mechAvailabilityService.findByFactionAndPeriod(+factionId, +periodId); // Преобразуем в числа
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mech availability record' })
  @ApiParam({ name: 'id', description: 'Mech availability ID' })
  async update(
    @Param('id') id: string,
    @Body() updateMechAvailabilityDto: UpdateMechAvailabilityDto,
  ): Promise<MechAvailability> {
    return this.mechAvailabilityService.update(id, updateMechAvailabilityDto); // ID теперь используется как строка
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mech availability record' })
  @ApiParam({ name: 'id', description: 'Mech availability ID' })
  async remove(@Param('id') id: string): Promise<MechAvailability> {
    return this.mechAvailabilityService.remove(id); // ID теперь используется как строка
  }
}