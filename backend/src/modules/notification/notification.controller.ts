import { Controller, Get, Put, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Request() req) {
    const userId = req.user.id;
    const notifications = await this.notificationService.getUserNotifications(userId);
    return notifications;
  }

  @Get('unread')
  async getUnreadNotifications(@Request() req) {
    const userId = req.user.id;
    return this.notificationService.getUserNotifications(userId, 'UNREAD');
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.notificationService.markAsRead(id, userId);
  }

  @Put('mark-all-read')
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.notificationService.deleteNotification(id, userId);
  }
}

