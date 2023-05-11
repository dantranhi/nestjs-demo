import { DynamicModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailOptions } from '@hapi/joi';
import { EMAIL_CONFIG_OPTIONS } from 'src/shared/constants/email.constant';
import EmailAsyncOptions from './interfaces/email-options.type';

@Module({})
export class EmailModule {
  static register(options: EmailOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: EMAIL_CONFIG_OPTIONS,
          useValue: options,
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
  static registerAsync(options: EmailAsyncOptions): DynamicModule {
    return {
      module: EmailModule,
      imports: options.imports,
      providers: [
        {
          provide: EMAIL_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
