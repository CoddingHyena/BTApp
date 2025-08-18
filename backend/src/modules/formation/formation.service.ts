import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
import { FormationMemberRole, FormationType } from '@prisma/client';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Injectable()
export class FormationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFormationDto) {
    await this.ensureCampaignAndFaction(dto.campaignId, dto.factionId);
    if (dto.parentFormationId) {
      await this.ensureParentWithDto(dto.parentFormationId, dto.type, dto.isCommandLance ?? false, dto.isCommanderCompany ?? false);
    }
    return this.prisma.formation.create({ data: dto, include: { members: true, childFormations: true, parentFormation: true } });
  }

  async findAll(filters: { campaignId?: string; factionId?: number }) {
    const where: any = {};
    if (filters.campaignId) where.campaignId = filters.campaignId;
    if (typeof filters.factionId === 'number') where.factionId = filters.factionId;
    return this.prisma.formation.findMany({ where, include: { members: true, childFormations: true } });
  }

  async findOne(id: string) {
    const f = await this.prisma.formation.findUnique({ where: { id }, include: { members: true, childFormations: true } });
    if (!f) throw new NotFoundException('Формация не найдена');
    return f;
  }

  async update(id: string, dto: UpdateFormationDto) {
    const exists = await this.prisma.formation.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Формация не найдена');
    if (dto.parentFormationId) await this.ensureParentWithDto(dto.parentFormationId, dto.type ?? exists.type, dto.isCommandLance ?? exists.isCommandLance, dto.isCommanderCompany ?? exists.isCommanderCompany);
    await this.validateFlagConsistency(id, exists, dto);
    return this.prisma.formation.update({ where: { id }, data: dto, include: { members: true, childFormations: true, parentFormation: true } });
  }

  async remove(id: string) {
    const exists = await this.prisma.formation.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Формация не найдена');
    return this.prisma.formation.delete({ where: { id } });
  }

  // Управление составом
  async addMember(formationId: string, dto: AddMemberDto) {
    const formation = await this.prisma.formation.findUnique({ where: { id: formationId }, include: { members: true, parentFormation: true, childFormations: true } });
    if (!formation) throw new NotFoundException('Формация не найдена');

    const unit = await this.prisma.campaignUnit.findUnique({ 
      where: { id: dto.campaignUnitId },
      include: { pilot: true }
    });
    if (!unit) throw new NotFoundException('Юнит не найден');
    if (!unit.pilot) throw new NotFoundException('Юнит должен иметь назначенного пилота');

    const existing = await this.prisma.formationMember.findFirst({ where: { campaignUnitId: dto.campaignUnitId } });
    if (existing) throw new BadRequestException('Юнит уже состоит в другой формации');

    // Бизнес-правила составов
    await this.validateMembershipRulesOnAdd(formation.id, formation.type, unit.pilot.rank);

    return this.prisma.formationMember.create({
      data: {
        formationId,
        campaignUnitId: dto.campaignUnitId,
        pilotId: unit.pilot.id,
        slotIndex: dto.slotIndex,
      },
    });
  }

  async removeMember(formationId: string, memberId: string) {
    const member = await this.prisma.formationMember.findUnique({ where: { id: memberId } });
    if (!member || member.formationId !== formationId) throw new NotFoundException('Участник не найден в указанной формации');
    return this.prisma.formationMember.delete({ where: { id: memberId } });
  }

  async updateMemberRole(formationId: string, memberId: string, dto: UpdateMemberRoleDto) {
    const member = await this.prisma.formationMember.findUnique({ 
      where: { id: memberId },
      include: { pilot: true }
    });
    if (!member || member.formationId !== formationId) throw new NotFoundException('Участник не найден в указанной формации');
    
    // Обновляем роль пилота
    const pilot = await this.prisma.campaignPilot.findUnique({ where: { id: dto.pilotId } });
    if (!pilot) throw new NotFoundException('Пилот не найден');
    
    // Валидация ролей
    await this.validateMembershipRulesOnRoleChange(formationId, pilot.rank);
    
    // Обновляем связь с пилотом
    return this.prisma.formationMember.update({ 
      where: { id: memberId }, 
      data: { pilotId: dto.pilotId } 
    });
  }

  private async validateMembershipRulesOnAdd(formationId: string, type: FormationType, newRole: FormationMemberRole) {
    const members = await this.prisma.formationMember.findMany({ 
      where: { formationId },
      include: { pilot: true }
    });
    if (type === 'LANCE') {
      if (members.length >= 4) throw new BadRequestException('Лэнс уже укомплектован (4)');
      // Командный лэнс — отдельная логика на роли, но флаг берём с Formation
      const formation = await this.prisma.formation.findUnique({ where: { id: formationId } });
      if (formation?.isCommandLance) {
        // 3 Bodyguards + 1 Division Commander
        const bodyguards = members.filter(m => m.pilot?.rank === 'BODYGUARD').length + (newRole === 'BODYGUARD' ? 1 : 0);
        const commanders = members.filter(m => m.pilot?.rank === 'DIVISION_COMMANDER').length + (newRole === 'DIVISION_COMMANDER' ? 1 : 0);
        if (commanders > 1) throw new BadRequestException('В командном лэнсе может быть ровно один Division Commander');
        if (bodyguards > 3) throw new BadRequestException('В командном лэнсе может быть максимум три Bodyguards');
        if (members.length + 1 === 4 && (bodyguards !== 3 || commanders !== 1)) {
          throw new BadRequestException('Командный лэнс должен состоять из 3 Bodyguards и 1 Division Commander');
        }
      } else {
        const leaders = members.filter(m => m.pilot?.rank === 'LANCE_LEADER').length + (newRole === 'LANCE_LEADER' ? 1 : 0);
        if (leaders > 1) throw new BadRequestException('В лэнсе может быть ровно один Lance Leader');
      }
    }
    if (type === 'COMPANY') {
      // Запрещаем прямое добавление юнитов в роту (только через дочерние лэнсы)
      throw new BadRequestException('Юниты должны добавляться в лэнсы, а не напрямую в роту');
    }
    if (type === 'DIVISION') {
      throw new BadRequestException('Юниты не могут добавляться напрямую в дивизию');
    }
  }

  private async validateMembershipRulesOnRoleChange(formationId: string, role: FormationMemberRole) {
    const formation = await this.prisma.formation.findUnique({ where: { id: formationId } });
    if (!formation) throw new NotFoundException('Формация не найдена');
    const members = await this.prisma.formationMember.findMany({ 
      where: { formationId },
      include: { pilot: true }
    });
    if (formation.type === 'LANCE') {
      if (formation.isCommandLance) {
        const bodyguards = members.filter(m => m.pilot?.rank === 'BODYGUARD').length + (role === 'BODYGUARD' ? 1 : 0);
        const commanders = members.filter(m => m.pilot?.rank === 'DIVISION_COMMANDER').length + (role === 'DIVISION_COMMANDER' ? 1 : 0);
        if (commanders > 1) throw new BadRequestException('В командном лэнсе может быть ровно один Division Commander');
        if (bodyguards > 3) throw new BadRequestException('В командном лэнсе может быть максимум три Bodyguards');
      } else {
        const leaders = members.filter(m => m.pilot?.rank === 'LANCE_LEADER').length + (role === 'LANCE_LEADER' ? 1 : 0);
        if (leaders > 1) throw new BadRequestException('В лэнсе может быть ровно один Lance Leader');
      }
    }
    if (formation.type === 'COMPANY') {
      const leaders = members.filter(m => m.pilot?.rank === 'COMPANY_LEADER').length + (role === 'COMPANY_LEADER' ? 1 : 0);
      if (leaders > 1) throw new BadRequestException('В роте может быть ровно один Company Leader');
    }
  }

  private async ensureCampaignAndFaction(campaignId: string, factionId: number) {
    const [campaign, faction] = await Promise.all([
      this.prisma.campaign.findUnique({ where: { id: campaignId } }),
      this.prisma.faction.findUnique({ where: { id: factionId } }),
    ]);
    if (!campaign) throw new BadRequestException('Кампания не найдена');
    if (!faction) throw new BadRequestException('Фракция не найдена');
  }

  private async ensureParentWithDto(parentFormationId: string, childType: FormationType, isCommandLance: boolean, isCommanderCompany: boolean) {
    const parent = await this.prisma.formation.findUnique({ where: { id: parentFormationId }, include: { childFormations: true } });
    if (!parent) throw new BadRequestException('Родительская формация не найдена');
    // Простые правила иерархии: LANCE -> parent COMPANY; COMPANY -> parent DIVISION
    if (childType === 'LANCE' && parent.type !== 'COMPANY') throw new BadRequestException('Лэнс может принадлежать только роте');
    if (childType === 'COMPANY' && parent.type !== 'DIVISION') throw new BadRequestException('Рота может принадлежать только дивизии');
    if (childType === 'DIVISION') throw new BadRequestException('Дивизия не может иметь родителя');

    // Ограничения по количеству детей
    if (childType === 'LANCE') {
      const maxLances = parent.isCommanderCompany ? 4 : 3;
      if (parent.childFormations.length >= maxLances) throw new BadRequestException(`В роте уже ${parent.childFormations.length} лэнсов. Максимум: ${maxLances}`);
      // Командный лэнс можно добавить только в командирскую роту
      if (isCommandLance && !parent.isCommanderCompany) throw new BadRequestException('Командный лэнс может быть только в командирской роте');
      if (isCommandLance) {
        const hasCmd = parent.childFormations.some((c) => c.isCommandLance);
        if (hasCmd) throw new BadRequestException('В командирской роте уже есть командный лэнс');
      }
    }
    if (childType === 'COMPANY') {
      if (parent.childFormations.length >= 3) throw new BadRequestException('В дивизии максимум 3 роты');
      if (isCommanderCompany) {
        const hasCommander = parent.childFormations.some((c) => c.isCommanderCompany);
        if (hasCommander) throw new BadRequestException('В дивизии уже есть командирская рота');
      }
    }
  }

  private async validateFlagConsistency(id: string, exists: any, dto: UpdateFormationDto) {
    // Проверяем флаги на согласованность с родителем
    const formation = await this.prisma.formation.findUnique({ where: { id }, include: { parentFormation: true } });
    const parent = formation?.parentFormation;
    const type = dto.type ?? exists.type;
    const isCmdLance = dto.isCommandLance ?? exists.isCommandLance;
    const isCmdCompany = dto.isCommanderCompany ?? exists.isCommanderCompany;
    if (type === 'LANCE' && isCmdLance) {
      if (!parent || parent.type !== 'COMPANY' || !parent.isCommanderCompany) {
        throw new BadRequestException('Командный лэнс возможен только внутри командирской роты');
      }
    }
    if (type === 'COMPANY' && isCmdCompany) {
      if (!parent || parent.type !== 'DIVISION') {
        throw new BadRequestException('Командирская рота возможна только внутри дивизии');
      }
      const siblings = await this.prisma.formation.findMany({ where: { parentFormationId: parent.id, NOT: { id } } });
      if (siblings.some((s) => s.isCommanderCompany)) throw new BadRequestException('В дивизии уже есть командирская рота');
    }
  }

  async validateFormation(id: string) {
    const errors: string[] = [];
    const formation = await this.prisma.formation.findUnique({ 
      where: { id }, 
      include: { 
        members: { include: { pilot: true } }, 
        childFormations: true 
      } 
    });
    if (!formation) throw new NotFoundException('Формация не найдена');
    if (formation.type === 'LANCE') {
      const count = formation.members.length;
      if (count !== 4) errors.push('Лэнс должен содержать ровно 4 юнита');
      if (formation.isCommandLance) {
        const bg = formation.members.filter((m) => m.pilot?.rank === 'BODYGUARD').length;
        const dc = formation.members.filter((m) => m.pilot?.rank === 'DIVISION_COMMANDER').length;
        if (bg !== 3 || dc !== 1) errors.push('Командный лэнс: требуются 3 Bodyguards и 1 Division Commander');
      } else {
        const leaders = formation.members.filter((m) => m.pilot?.rank === 'LANCE_LEADER').length;
        if (leaders !== 1) errors.push('В лэнсе должен быть ровно один Lance Leader');
      }
    }
    if (formation.type === 'COMPANY') {
      const lances = formation.childFormations.filter((c) => c.type === 'LANCE');
      const expected = formation.isCommanderCompany ? 4 : 3;
      if (lances.length !== expected) errors.push(`В роте должно быть ровно ${expected} лэнса`);
      // Один Company Leader в составе роты (разрешаем прямое членство только для лидера)
      const leaders = formation.members.filter((m) => m.pilot?.rank === 'COMPANY_LEADER').length;
      if (leaders !== 1) errors.push('В роте должен быть ровно один Company Leader');
      if (formation.isCommanderCompany) {
        const cmdLances = lances.filter((l) => l.isCommandLance).length;
        if (cmdLances !== 1) errors.push('В командирской роте должен быть один командный лэнс');
      }
    }
    if (formation.type === 'DIVISION') {
      const companies = formation.childFormations.filter((c) => c.type === 'COMPANY');
      if (companies.length !== 3) errors.push('В дивизии должно быть ровно 3 роты');
      const commanderCompanies = companies.filter((c) => c.isCommanderCompany);
      if (commanderCompanies.length !== 1) errors.push('В дивизии должна быть ровно одна командирская рота');
    }
    return { isValid: errors.length === 0, errors };
  }
}


