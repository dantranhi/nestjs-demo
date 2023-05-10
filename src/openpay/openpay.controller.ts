import { Controller, Get, Post, Query } from '@nestjs/common';
import { OpenpayService } from './openpay.service';

@Controller('openpay')
export class OpenpayController {
  constructor(private openpayService: OpenpayService) {}

  @Post('create')
  createOrder() {
    return this.openpayService.createOrder();
  }

  @Get('status')
  getStatus(@Query('orderId') orderId: string) {
    return this.openpayService.getStatus(orderId);
  }

  @Post('capture')
  captureOrder(@Query('orderId') orderId: string) {
    return this.openpayService.captureOrder(orderId);
  }
}
