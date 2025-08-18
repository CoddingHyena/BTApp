import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType, NotificationStatus } from '@prisma/client';

export interface CreateNotificationDto {
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(data: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        recipientId: data.recipientId,
        senderId: data.senderId,
        campaignId: data.campaignId,
        metadata: data.metadata || {},
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserNotifications(userId: string, status?: NotificationStatus) {
    const where: any = { recipientId: userId };
    
    if (status) {
      where.status = status;
    }

    return this.prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        recipientId: userId,
        status: NotificationStatus.UNREAD,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.READ,
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        recipientId: userId,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
        isRead: true,
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  // Специальный метод для создания уведомления о приглашении в кампанию
  async createCampaignInviteNotification(
    recipientId: string,
    senderId: string,
    campaignId: string,
    campaignName: string,
    senderUsername: string,
  ) {
    const notification = await this.createNotification({
      type: NotificationType.CAMPAIGN_INVITE,
      title: 'Приглашение в кампанию',
      message: `Пользователь ${senderUsername} приглашает вас присоединиться к кампании "${campaignName}"`,
      recipientId,
      senderId,
      campaignId,
      metadata: {
        campaignName,
        senderUsername,
      },
    });

    return notification;
  }
}

