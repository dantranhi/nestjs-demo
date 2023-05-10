import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import RequestWithUser from 'src/auth/interface/request-user.interface';
import CreateChargeDto from './dto/createCharge.dto';
import StripeService from './stripe.service';

@Controller('charge')
export class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create')
  async createSession(
    @Body('customerId') customerId: string,
    @Req() request: RequestWithUser,
  ) {
    const url = await this.stripeService.createPaymentUrl(customerId);
    return { url };
  }

  //   @UseGuards(JwtAuthenticationGuard)
  @Post('')
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      'cus_NcRmVpYmCJgatG',
      //   request.user.stripeCustomerId,
    );
  }
}
