import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AssignStrategistDto } from './dto/assign-strategist.dto';
import { Campaign, CampaignType, PlayerRole } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  async create(createCampaignDto: CreateCampaignDto, creatorId: string): Promise<Campaign> {
    if (!creatorId) {
      throw new BadRequestException('Creator ID is required');
    }

    // Проверяем, что пользователь существует в базе данных
    const user = await this.userService.validateUser(creatorId);

    // Проверяем, что игра существует
    const game = await this.prisma.game.findUnique({
      where: { id: createCampaignDto.gameId },
    });

    if (!game) {
      throw new BadRequestException('Game not found');
    }

    // Если указан родитель, проверяем его существование
    if (createCampaignDto.parentCampaignId) {
      const parentCampaign = await this.prisma.campaign.findUnique({
        where: { id: createCampaignDto.parentCampaignId },
      });

      if (!parentCampaign) {
        throw new BadRequestException('Parent campaign not found');
      }
    }

    const campaignData: any = {
      name: createCampaignDto.name,
      description: createCampaignDto.description,
      campaignType: createCampaignDto.campaignType,
      status: createCampaignDto.status,
      startDate: createCampaignDto.startDate ? new Date(createCampaignDto.startDate) : null,
      endDate: createCampaignDto.endDate ? new Date(createCampaignDto.endDate) : null,
      accessType: createCampaignDto.accessType,
      maxPlayers: createCampaignDto.maxPlayers,
      minPlayers: createCampaignDto.minPlayers,
      commonRules: createCampaignDto.commonRules || {},
      gameSpecificRules: createCampaignDto.gameSpecificRules || {},
      tags: createCampaignDto.tags || [],
      metadata: createCampaignDto.metadata || {},
      imageUrl: createCampaignDto.imageUrl,
      geographicScope: createCampaignDto.geographicScope,
      thematicFocus: createCampaignDto.thematicFocus,
      eventType: createCampaignDto.eventType,
      durationHours: createCampaignDto.durationHours,
      maxParticipants: createCampaignDto.maxParticipants,
      autoGenerate: createCampaignDto.autoGenerate,
      triggerConditions: createCampaignDto.triggerConditions || {},
      completionConditions: createCampaignDto.completionConditions || {},
      rewards: createCampaignDto.rewards || {},
      game: {
        connect: { id: createCampaignDto.gameId }
      },
    };

    if (creatorId) {
      campaignData.creator = {
        connect: { id: creatorId }
      };
    }

    if (createCampaignDto.parentCampaignId) {
      campaignData.parentCampaign = {
        connect: { id: createCampaignDto.parentCampaignId }
      };
    }

    // Проверяем и валидируем фракции
    if (createCampaignDto.factionIds && createCampaignDto.factionIds.length > 0) {
      // Проверяем, что все фракции существуют и принадлежат указанной игре
      const factions = await this.prisma.faction.findMany({
        where: {
          id: { in: createCampaignDto.factionIds },
          gameIdRef: createCampaignDto.gameId,
        },
      });

      if (factions.length !== createCampaignDto.factionIds.length) {
        throw new BadRequestException('Some factions do not exist or do not belong to the specified game');
      }

      // Проверяем, что все фракции являются материнскими (не дочерними)
      const childFactions = factions.filter(faction => faction.parentFactionId);
      if (childFactions.length > 0) {
        const childFactionNames = childFactions.map(f => f.name).join(', ');
        throw new BadRequestException(`Cannot assign child factions to campaign: ${childFactionNames}`);
      }

      // Добавляем связь с фракциями
      campaignData.campaignFactions = {
        create: createCampaignDto.factionIds.map(factionId => ({
          faction: { connect: { id: factionId } }
        }))
      };
    }

    return this.prisma.campaign.create({
      data: campaignData as any,
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        campaignFactions: {
          include: {
            faction: true,
          },
        },
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
        economy: true,
        progress: true,
        battleReports: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async findByType(type: CampaignType): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      where: { campaignType: type },
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });
  }

  async findByGame(gameId: string): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      where: { gameId },
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    // Проверяем существование кампании
    const existingCampaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    // Если обновляется gameId, проверяем существование игры
    if (updateCampaignDto.gameId) {
      const game = await this.prisma.game.findUnique({
        where: { id: updateCampaignDto.gameId },
      });

      if (!game) {
        throw new BadRequestException('Game not found');
      }
    }

    // Если обновляется parentCampaignId, проверяем существование родителя
    if (updateCampaignDto.parentCampaignId) {
      const parentCampaign = await this.prisma.campaign.findUnique({
        where: { id: updateCampaignDto.parentCampaignId },
      });

      if (!parentCampaign) {
        throw new BadRequestException('Parent campaign not found');
      }
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...updateCampaignDto,
        startDate: updateCampaignDto.startDate ? new Date(updateCampaignDto.startDate) : undefined,
        endDate: updateCampaignDto.endDate ? new Date(updateCampaignDto.endDate) : undefined,
      },
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return this.prisma.campaign.delete({
      where: { id },
      include: {
        game: true,
        creator: true,
        parentCampaign: true,
        childCampaigns: true,
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });
  }

  // Новые методы для управления стратегами
  async getStrategists(id: string) {
    const players = await this.prisma.campaignPlayer.findMany({
      where: {
        campaignId: id,
        role: PlayerRole.STRATEGIST,
      },
      include: {
        player: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        faction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return players;
  }

  async assignStrategist(id: string, assignStrategistDto: AssignStrategistDto, userId: string) {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        creator: true,
        players: {
          where: {
            role: PlayerRole.STRATEGIST,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Проверяем права доступа (только создатель кампании или администратор может назначать стратегов)
    if (campaign.creator.id !== userId) {
      const user = await this.userService.validateUser(userId);
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('Only campaign creator or admin can assign strategists');
      }
    }

    // Проверяем существование пользователя
    const user = await this.userService.validateUser(assignStrategistDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Проверяем существование фракции
    const faction = await this.prisma.faction.findUnique({
      where: { id: assignStrategistDto.factionId },
    });

    if (!faction) {
      throw new NotFoundException('Faction not found');
    }

    // Проверяем, что фракция не занята другим стратегом
    const existingStrategist = await this.prisma.campaignPlayer.findFirst({
      where: {
        campaignId: id,
        factionId: assignStrategistDto.factionId,
        role: PlayerRole.STRATEGIST,
      },
    });

    if (existingStrategist) {
      throw new BadRequestException('Faction already has a strategist assigned');
    }

    // Проверяем, что пользователь не является стратегом в другой кампании
    const userAsStrategist = await this.prisma.campaignPlayer.findFirst({
      where: {
        playerId: assignStrategistDto.userId,
        role: PlayerRole.STRATEGIST,
        campaignId: {
          not: id, // Исключаем текущую кампанию
        },
      },
    });

    if (userAsStrategist) {
      throw new BadRequestException('User is already a strategist in another campaign');
    }

    // Создаем или обновляем запись игрока кампании
    const campaignPlayer = await this.prisma.campaignPlayer.upsert({
      where: {
        campaignId_playerId: {
          campaignId: id,
          playerId: assignStrategistDto.userId,
        },
      },
      update: {
        factionId: assignStrategistDto.factionId,
        role: PlayerRole.STRATEGIST,
      },
      create: {
        campaignId: id,
        playerId: assignStrategistDto.userId,
        factionId: assignStrategistDto.factionId,
        role: PlayerRole.STRATEGIST,
      },
      include: {
        player: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        faction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return campaignPlayer;
  }

  async removeStrategist(id: string, factionId: number, userId: string) {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        creator: true,
        players: {
          where: {
            factionId: factionId,
            role: PlayerRole.STRATEGIST,
          },
          include: {
            player: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Проверяем права доступа (только создатель кампании, администратор или сам стратег может снять назначение)
    const strategist = campaign.players[0];
    if (campaign.creator.id !== userId && strategist?.player.id !== userId) {
      const user = await this.userService.validateUser(userId);
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('Only campaign creator, admin, or the strategist can remove strategist');
      }
    }

    // Удаляем назначение стратега
    const result = await this.prisma.campaignPlayer.updateMany({
      where: {
        campaignId: id,
        factionId: factionId,
        role: PlayerRole.STRATEGIST,
      },
      data: {
        role: PlayerRole.PLAYER,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Strategist not found for this faction');
    }

    return { message: 'Strategist removed successfully' };
  }

  async getAvailableUsers(id: string) {
    // Если ID равен 'temp', возвращаем всех активных пользователей
    // (для создания новой кампании)
    if (id === 'temp') {
      const users = await this.prisma.user.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
        },
        orderBy: {
          username: 'asc',
        },
      });

      return users;
    }

    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Получаем всех активных пользователей, которые не участвуют в текущей кампании
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        // Исключаем пользователей, которые уже участвуют в текущей кампании
        campaignPlayers: {
          none: {
            campaignId: id,
          },
        },
      },
              select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
        },
      orderBy: {
        username: 'asc',
      },
    });

    return users;
  }

  async getHierarchy(id: string): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        game: true,
        creator: true,
        parentCampaign: {
          include: {
            parentCampaign: true,
            game: true,
          },
        },
        childCampaigns: {
          include: {
            childCampaigns: true,
            game: true,
          },
        },
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async getPlayers(id: string) {
    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Получаем всех участников кампании
    const players = await this.prisma.campaignPlayer.findMany({
      where: {
        campaignId: id,
      },
      include: {
        player: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        faction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return players;
  }

  async invitePlayer(campaignId: string, userId: string, inviterId: string) {
    if (!inviterId) {
      throw new BadRequestException('Inviter ID is required');
    }

    // Проверяем существование кампании
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        creator: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Проверяем существование пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Проверяем, что пользователь уже не участвует в кампании
    const existingPlayer = await this.prisma.campaignPlayer.findFirst({
      where: {
        campaignId,
        playerId: userId,
      },
    });

    if (existingPlayer) {
      throw new BadRequestException('User is already a participant in this campaign');
    }

    // Проверяем, не было ли уже приглашения за последние 24 часа
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentInvitation = await this.prisma.notification.findFirst({
      where: {
        type: 'CAMPAIGN_INVITE',
        recipientId: userId,
        campaignId: campaignId,
        senderId: inviterId,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    if (recentInvitation) {
      const timeUntilNextInvite = new Date(recentInvitation.createdAt.getTime() + 24 * 60 * 60 * 1000);
      throw new BadRequestException(
        `Приглашение уже было отправлено этому пользователю. Следующее приглашение можно отправить после ${timeUntilNextInvite.toLocaleString('ru-RU')}`
      );
    }

    // Получаем информацию о приглашающем пользователе
    const inviter = await this.prisma.user.findUnique({
      where: { id: inviterId },
      select: { username: true },
    });

    // Создаем уведомление о приглашении
    const notification = await this.notificationService.createCampaignInviteNotification(
      userId,
      inviterId,
      campaignId,
      campaign.name,
      inviter?.username || 'Unknown',
    );

    console.log(`📧 Приглашение отправлено: ${inviter?.username || 'Unknown'} → ${user.username} в кампанию "${campaign.name}" (${new Date().toLocaleString('ru-RU')})`);

    return {
      message: 'Invitation sent successfully',
      campaignId,
      userId,
    };
  }

  async getRecentInvitations(campaignId: string, userId: string) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentInvitations = await this.prisma.notification.findMany({
      where: {
        type: 'CAMPAIGN_INVITE',
        recipientId: userId,
        campaignId: campaignId,
        createdAt: {
          gte: oneDayAgo,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recentInvitations.map(invitation => ({
      id: invitation.id,
      senderUsername: invitation.sender?.username || 'Unknown',
      createdAt: invitation.createdAt,
      nextInviteTime: new Date(invitation.createdAt.getTime() + 24 * 60 * 60 * 1000),
    }));
  }

  async updatePlayerFaction(campaignId: string, playerId: string, factionId: number | null, adminId: string) {
    console.log('=== UPDATE PLAYER FACTION DEBUG ===');
    console.log('Campaign ID:', campaignId);
    console.log('Player ID (CampaignPlayer ID):', playerId);
    console.log('Faction ID:', factionId);
    console.log('Admin ID:', adminId);
    
    // Проверяем, что кампания существует
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      console.log('Campaign not found');
      throw new NotFoundException('Campaign not found');
    }
    
    console.log('Campaign found:', campaign.name);

    // Проверяем, что игрок существует в кампании
    console.log('Looking for player in campaign...');
    const player = await this.prisma.campaignPlayer.findUnique({
      where: {
        id: playerId, // playerId здесь - это ID записи в CampaignPlayer
      },
      include: {
        player: true,
        faction: true,
      },
    });

    if (!player) {
      console.log('Player not found in campaign');
      throw new NotFoundException('Player not found in campaign');
    }
    
    // Проверяем, что игрок принадлежит к указанной кампании
    if (player.campaignId !== campaignId) {
      console.log('Player does not belong to this campaign');
      throw new NotFoundException('Player does not belong to this campaign');
    }
    
    console.log('Player found:', player.player?.username || 'Unknown');

    // Проверяем права администратора
    console.log('Checking admin permissions...');
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      console.log('Admin user not found');
      throw new NotFoundException('Admin user not found');
    }
    
    console.log('Admin found:', admin.username, 'Role:', admin.role);

    // Проверяем, что пользователь является администратором или создателем кампании
    if (admin.role !== 'ADMIN' && campaign.creatorId !== adminId) {
      console.log('Insufficient permissions. Admin role:', admin.role, 'Campaign creator:', campaign.creatorId);
      throw new ForbiddenException('Insufficient permissions to update player faction');
    }
    
    console.log('Permissions check passed');

    // Если указана фракция, проверяем её существование и участие в кампании
    if (factionId !== null) {
      console.log('Checking faction existence and campaign participation...');
      const faction = await this.prisma.faction.findUnique({
        where: { id: factionId },
      });

      if (!faction) {
        console.log('Faction not found:', factionId);
        throw new NotFoundException('Faction not found');
      }
      
      // Проверяем, что это материнская фракция (без родительской фракции)
      if (faction.parentFactionId) {
        console.log('Cannot assign to child faction:', faction.name);
        throw new BadRequestException(`Нельзя назначить игрока в дочернюю фракцию "${faction.name}". Выберите материнскую фракцию.`);
      }
      
      // Проверяем, что фракция зафиксирована в кампании
      const campaignFaction = await this.prisma.campaignFaction.findUnique({
        where: {
          campaignId_factionId: {
            campaignId,
            factionId,
          },
        },
      });

      if (!campaignFaction) {
        console.log('Faction is not fixed in this campaign:', faction.name);
        throw new BadRequestException(`Фракция "${faction.name}" не зафиксирована в данной кампании`);
      }
      
      console.log('Faction found and participates in campaign:', faction.name);
    } else {
      console.log('Setting player to neutral (no faction)');
    }

    // Обновляем фракцию игрока
    console.log('Updating player faction...');
    try {
      const updatedPlayer = await this.prisma.campaignPlayer.update({
        where: {
          id: player.id,
        },
        data: {
          factionId: factionId,
        },
        include: {
          player: true,
          faction: true,
        },
      });

      console.log('Player faction updated successfully');
      console.log('=== END UPDATE PLAYER FACTION DEBUG ===');
      return updatedPlayer;
    } catch (error) {
      console.error('Error updating player faction:', error);
      console.log('=== END UPDATE PLAYER FACTION DEBUG ===');
      throw error;
    }
  }

  async getCampaignFactions(campaignId: string) {
    const campaignFactions = await this.prisma.campaignFaction.findMany({
      where: { campaignId },
      include: {
        faction: true,
      },
    });

    return campaignFactions.map(cf => cf.faction);
  }
} 