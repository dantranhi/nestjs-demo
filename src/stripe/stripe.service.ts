import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async createPaymentUrl(customerId: string) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1MrGPTIalcfCNNa3Lyylu5cv',
          quantity: 1,
        },
      ],
      customer: customerId,
      mode: 'payment',
      success_url: 'http://localhost:3000/payment/success',
      cancel_url: 'http://localhost:3000/payment/cancel',
    });

    return session.url;
  }

  public async charge(
    amount: number,
    paymentMethodId: string,
    customerId: string,
  ) {
    if (!paymentMethodId || amount < 1) {
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
    return await this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      confirm: true,
    });
  }

  async refundPayment(orderId: number) {
    const paymentIntentId = 'payment_intent_id';
    const refundAmount = 1000;
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );
    if (!paymentIntent) return { success: false, message: 'Payment not found' };
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
    });
    return { success: true, message: 'Refunded' };
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
