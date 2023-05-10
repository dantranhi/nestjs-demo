import { forwardRef, Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    CloudinaryModule,
    forwardRef(() => StripeModule),
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
