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
import { CampaignPilotService } from './campaign-pilot.service';
import { CreateCampaignPilotDto } from './dto/create-campaign-pilot.dto';
import { UpdateCampaignPilotDto } from './dto/update-campaign-pilot.dto';
import { GeneratePilotDto } from './dto/generate-pilot.dto';
import { RegeneratePilotDto } from './dto/regenerate-pilot.dto';
import { ValidateNameDto } from './dto/validate-name.dto';
import { GetGenderFromNameDto } from './dto/get-gender-from-name.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { PilotStatus } from '@prisma/client';

@Controller('campaign-pilots')
@UseGuards(AuthGuard)
export class CampaignPilotController {
  constructor(private readonly campaignPilotService: CampaignPilotService) {}

  @Post()
  create(@Body() createCampaignPilotDto: CreateCampaignPilotDto) {
    return this.campaignPilotService.create(createCampaignPilotDto);
  }

  @Get()
  findAll() {
    return this.campaignPilotService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignPilotService.findByCampaign(campaignId);
  }

  @Get('campaign/:campaignId/faction/:factionId')
  findByFaction(
    @Param('campaignId') campaignId: string,
    @Param('factionId') factionId: string
  ) {
    return this.campaignPilotService.findByFaction(campaignId, parseInt(factionId));
  }

  @Get('campaign/:campaignId/faction/:factionId/available')
  findAvailablePilots(
    @Param('campaignId') campaignId: string,
    @Param('factionId') factionId: string
  ) {
    return this.campaignPilotService.findAvailablePilots(campaignId, parseInt(factionId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignPilotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignPilotDto: UpdateCampaignPilotDto) {
    return this.campaignPilotService.update(id, updateCampaignPilotDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PilotStatus
  ) {
    return this.campaignPilotService.updateStatus(id, status);
  }

  @Patch(':id/experience')
  addExperience(
    @Param('id') id: string,
    @Body('experience') experience: number
  ) {
    return this.campaignPilotService.addExperience(id, experience);
  }

  @Patch(':id/assign/:unitId')
  assignToUnit(
    @Param('id') pilotId: string,
    @Param('unitId') unitId: string
  ) {
    return this.campaignPilotService.assignToUnit(pilotId, unitId);
  }

  @Patch(':id/remove-from-unit')
  removeFromUnit(@Param('id') pilotId: string) {
    return this.campaignPilotService.removeFromUnit(pilotId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignPilotService.remove(id);
  }

  // Новые эндпоинты для работы с генерацией пилотов

  @Post('generate')
  generatePilotData(@Body() generatePilotDto: GeneratePilotDto) {
    console.log('Received DTO:', generatePilotDto);
    return this.campaignPilotService.generatePilotData(generatePilotDto.factionId, generatePilotDto.gender);
  }

  @Post('regenerate')
  regeneratePilotData(@Body() regeneratePilotDto: RegeneratePilotDto) {
    return this.campaignPilotService.regeneratePilotData(regeneratePilotDto.factionId, regeneratePilotDto.currentGender);
  }

  @Post('validate-name')
  validatePilotName(@Body() validateNameDto: ValidateNameDto) {
    return this.campaignPilotService.validatePilotName(
      validateNameDto.firstName, 
      validateNameDto.lastName, 
      validateNameDto.gender, 
      validateNameDto.factionId
    );
  }

  @Post('get-gender-from-name')
  getGenderFromName(@Body() getGenderFromNameDto: GetGenderFromNameDto) {
    return this.campaignPilotService.getGenderFromName(getGenderFromNameDto.firstName, getGenderFromNameDto.factionId);
  }
}
