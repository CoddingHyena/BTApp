import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MechService } from './mech.service';
import { CreateMechDto } from './dto/create-mech.dto';
import { UpdateMechDto } from './dto/update-mech.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Mech } from '@prisma/client';

@ApiTags('mechs')
@Controller('mechs')
export class MechController {
  constructor(private readonly mechService: MechService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый Mech (только для администраторов)' })
  @ApiResponse({ status: 201, description: 'Mech успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  create(@Body() createMechDto: CreateMechDto): Promise<Mech> {
    return this.mechService.create(createMechDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все Mech записи' })
  @ApiResponse({ status: 200, description: 'Список всех Mech записей' })
  findAll(): Promise<Mech[]> {
    return this.mechService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить Mech по ID' })
  @ApiResponse({ status: 200, description: 'Mech найден' })
  @ApiResponse({ status: 404, description: 'Mech не найден' })
  findOne(@Param('id') id: string): Promise<Mech> {
    return this.mechService.findOne(id);
  }

  @Get('dbid/:dbId')
  @ApiOperation({ summary: 'Получить Mech по dbId' })
  @ApiResponse({ status: 200, description: 'Mech найден' })
  @ApiResponse({ status: 404, description: 'Mech не найден' })
  findByDbId(@Param('dbId') dbId: string): Promise<Mech> {
    return this.mechService.findByDbId(parseInt(dbId));
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить Mech (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Mech успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Mech не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  update(
    @Param('id') id: string,
    @Body() updateMechDto: UpdateMechDto,
  ): Promise<Mech> {
    return this.mechService.update(id, updateMechDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить Mech (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Mech успешно удален' })
  @ApiResponse({ status: 404, description: 'Mech не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  remove(@Param('id') id: string): Promise<Mech> {
    return this.mechService.remove(id);
  }
}
