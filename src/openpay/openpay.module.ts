import { Module } from '@nestjs/common';
import { OpenpayService } from './openpay.service';
import { OpenpayController } from './openpay.controller';

@Module({
  providers: [OpenpayService],
  controllers: [OpenpayController]
})
export class OpenpayModule {}
