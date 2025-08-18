import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FormationService } from './formation.service';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('formations')
@UseGuards(AuthGuard)
export class FormationController {
  constructor(private readonly formationService: FormationService) {}

  @Post()
  create(@Body() dto: CreateFormationDto) {
    return this.formationService.create(dto);
  }

  @Get()
  findAll(@Query('campaignId') campaignId?: string, @Query('factionId') factionId?: string) {
    return this.formationService.findAll({ campaignId, factionId: factionId ? Number(factionId) : undefined });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFormationDto) {
    return this.formationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formationService.remove(id);
  }

  @Get(':id/validate')
  validate(@Param('id') id: string) {
    return this.formationService.validateFormation(id);
  }

  // Управление составом
  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.formationService.addMember(id, dto);
  }

  @Patch(':id/members/:memberId/role')
  updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.formationService.updateMemberRole(id, memberId, dto);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.formationService.removeMember(id, memberId);
  }
}


