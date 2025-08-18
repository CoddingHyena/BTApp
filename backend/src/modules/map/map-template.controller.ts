import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('map/templates')
@UseGuards(AuthGuard)
export class MapTemplateController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  create(@Body() data: any) {
    return this.mapService.createTemplate(data);
  }

  @Get()
  findAll() {
    return this.mapService.findTemplates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapService.findTemplate(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.mapService.updateTemplate(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapService.removeTemplate(id);
  }
}


