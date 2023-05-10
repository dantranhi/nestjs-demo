import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChargeController } from './charge.controller';
import StripeService from './stripe.service';
import { StripeWebhookController } from './stripeWebhook.controller';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [ChargeController, StripeWebhookController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
