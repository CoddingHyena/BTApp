import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RawMechService } from './raw-mech.service';
import { UpdateRawMechDto } from './dto/update-raw-mech.dto';
import { ValidateRawMechDto } from './dto/validate-raw-mech.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RawMech, Mech } from '@prisma/client';

@ApiTags('raw-mechs')
@Controller('raw-mechs')
export class RawMechController {
  constructor(private readonly rawMechService: RawMechService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все RawMech записи (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список всех RawMech записей' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  findAll(): Promise<RawMech[]> {
    return this.rawMechService.findAll();
  }

  @Get('validated')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить валидированные RawMech записи (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список валидированных RawMech записей' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  findValidated(): Promise<RawMech[]> {
    return this.rawMechService.findValidated();
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить ожидающие валидации RawMech записи (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список ожидающих валидации RawMech записей' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  findPending(): Promise<RawMech[]> {
    return this.rawMechService.findPending();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить RawMech по ID (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'RawMech запись найдена' })
  @ApiResponse({ status: 404, description: 'RawMech не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  findOne(@Param('id') id: string): Promise<RawMech> {
    return this.rawMechService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить RawMech (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'RawMech успешно обновлен' })
  @ApiResponse({ status: 404, description: 'RawMech не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  update(
    @Param('id') id: string,
    @Body() updateRawMechDto: UpdateRawMechDto,
  ): Promise<RawMech> {
    return this.rawMechService.update(id, updateRawMechDto);
  }

  @Patch(':id/validate')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Валидировать RawMech и создать Mech (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'RawMech валидирован и Mech создан' })
  @ApiResponse({ status: 404, description: 'RawMech не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  validate(
    @Param('id') id: string,
    @Body() validateRawMechDto: ValidateRawMechDto,
  ): Promise<{ rawMech: RawMech; mech?: Mech }> {
    return this.rawMechService.validate(id, validateRawMechDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить RawMech (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'RawMech успешно удален' })
  @ApiResponse({ status: 404, description: 'RawMech не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  remove(@Param('id') id: string): Promise<RawMech> {
    return this.rawMechService.remove(id);
  }
}
