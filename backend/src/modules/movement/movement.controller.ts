import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MovementService } from './movement.service';
import { AuthGuard } from '../../auth/auth.guard';
import { MovementOrderType } from '@prisma/client';

@Controller('movement')
@UseGuards(AuthGuard)
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post('orders/:formationId')
  createOrder(
    @Param('formationId') formationId: string,
    @Body('pathNodeIds') pathNodeIds: string[],
    @Body('orderType') orderType?: MovementOrderType,
  ) {
    return this.movementService.createOrder(formationId, pathNodeIds, orderType);
  }

  @Post('orders/:orderId/cancel')
  cancelOrder(@Param('orderId') orderId: string) {
    return this.movementService.cancelOrder(orderId);
  }

  @Post('advance/:campaignId')
  advanceTurn(@Param('campaignId') campaignId: string) {
    return this.movementService.advanceTurn(campaignId);
  }
}


