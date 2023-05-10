import { Controller, Post, Query, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Observable, Subject, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly eventService: EventEmitter2,
  ) {}

  @Sse('sse')
  sse(@Query() sseQuery: any): Observable<MessageEvent> {
    const subject$ = new Subject();
    this.eventService.on('FILTER', (data) => {
      // if (sseQuery.email !== data.email) return;

      subject$.next(data);
    });

    return subject$.pipe(map((data: any): any => ({ data })));
  }

  @Post('send')
  async sendSse() {
    this.eventService.emit('FILTER', {
      email: 'a@gmail.com',
      isVerified: true,
    });
  }
}
