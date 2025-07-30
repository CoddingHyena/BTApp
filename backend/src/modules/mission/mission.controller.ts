import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission, MissionDifficulty } from '@prisma/client';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  async create(@Body() createMissionDto: CreateMissionDto): Promise<Mission> {
    return this.missionService.create(createMissionDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  async update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    return this.missionService.update(id, updateMissionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string): Promise<Mission> {
    return this.missionService.remove(id);
  }
}