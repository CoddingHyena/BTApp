import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission, MissionDifficulty } from '@prisma/client';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  async findAll(
    @Query('difficulty') difficulty?: MissionDifficulty,
  ): Promise<Mission[]> {
    return this.missionService.findAll({ difficulty });
  }

  @Get('active')
  async findActive(): Promise<Mission[]> {
    return this.missionService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Mission> {
    return this.missionService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Mission> {
    return this.missionService.findByCode(code);
  }

  @Post()
  async create(@Body() createMissionDto: CreateMissionDto): Promise<Mission> {
    return this.missionService.create(createMissionDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    return this.missionService.update(id, updateMissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Mission> {
    return this.missionService.remove(id);
  }
}