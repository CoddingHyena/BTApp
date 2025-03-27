import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { Period } from '@prisma/client';
// Раскомментируйте, когда добавите аутентификацию
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('periods')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Get()
  async findAll(): Promise<Period[]> {
    return this.periodService.findAll();
  }

  @Get('active')
  async findActive(): Promise<Period[]> {
    return this.periodService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Period> {
    return this.periodService.findOne(+id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Period> {
    return this.periodService.findByCode(code);
  }

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  async create(@Body() createPeriodDto: CreatePeriodDto): Promise<Period> {
    return this.periodService.create(createPeriodDto);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ): Promise<Period> {
    return this.periodService.update(+id, updatePeriodDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  async remove(@Param('id') id: string): Promise<Period> {
    return this.periodService.remove(+id);
  }
}