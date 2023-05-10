import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Headers,
  Inject,
  forwardRef,
} from '@nestjs/common';
import RequestWithRawBody from 'src/shared/interfaces/requestWithRawBody.interface';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import StripeService from './stripe.service';

@Controller('webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Post('')
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    if (event.type === 'payment_intent.succeeded') {
      console.log('A payment was successfully');
    }

    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.created'
    ) {
      const data = event.data.object as Stripe.Subscription;

      const customerId: string = data.customer as string;
      const subscriptionStatus = data.status;

      await this.userService.updateMonthlySubscriptionStatus(
        customerId,
        subscriptionStatus,
      );
    }
  }
}
