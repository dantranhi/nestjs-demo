import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailConfig } from './interfaces/email-config.interface';
import { EMAIL_CONFIG_OPTIONS } from 'src/shared/constants/email.constant';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(@Inject(EMAIL_CONFIG_OPTIONS) private config:EmailConfig ) {
    this.nodemailerTransport = createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  async sendMail(options: Mail.Options) {
    console.log('SENT')
    return await this.nodemailerTransport.sendMail(options);
  }

  
}
