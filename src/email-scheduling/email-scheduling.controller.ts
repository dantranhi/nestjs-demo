import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt-authentication.guard';
import EmailScheduleDto from './dto/emailSchedule.dto';
import { EmailSchedulingService } from './email-scheduling.service';

@Controller('email')
export class EmailSchedulingController {
  constructor(private emailSchedulingService: EmailSchedulingService) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
