import { Module } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';
import { EmailSchedulingController } from './email-scheduling.controller';
import { EmailModule } from 'src/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, EmailModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>({
      service: config.get('EMAIL_SERVICE'),
      user: config.get('EMAIL_USER'),
      password: config.get('EMAIL_PASSWORD')
    })
  })],
  providers: [EmailSchedulingService],
  controllers: [EmailSchedulingController],
})
export class EmailSchedulingModule {}
