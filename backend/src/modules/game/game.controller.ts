import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Game, GameCategory } from '@prisma/client';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую игру (только для администраторов)' })
  @ApiResponse({ status: 201, description: 'Игра успешно создана' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все игры' })
  @ApiResponse({ status: 200, description: 'Список всех игр' })
  findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Получить только активные игры' })
  @ApiResponse({ status: 200, description: 'Список активных игр' })
  findActive(): Promise<Game[]> {
    return this.gameService.findActive();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Получить все категории игр' })
  @ApiResponse({ status: 200, description: 'Список категорий игр' })
  getCategories(): Promise<GameCategory[]> {
    return this.gameService.getCategories();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Получить игры по категории' })
  @ApiResponse({ status: 200, description: 'Список игр в категории' })
  findByCategory(@Param('category') category: GameCategory): Promise<Game[]> {
    return this.gameService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить игру по ID' })
  @ApiResponse({ status: 200, description: 'Детали игры' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  findOne(@Param('id') id: string): Promise<Game> {
    return this.gameService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Получить игру по названию' })
  @ApiResponse({ status: 200, description: 'Детали игры' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  findByName(@Param('name') name: string): Promise<Game> {
    return this.gameService.findByName(name);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить игру (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Игра успешно обновлена' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): Promise<Game> {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить игру (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Игра успешно удалена' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  remove(@Param('id') id: string): Promise<Game> {
    return this.gameService.remove(id);
  }
} 