import { Injectable } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'firebase-adminsdk.json'),
  ),
});

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}
  sendMessage(message: string): Observable<any> {
    return interval(1000).pipe(map((_) => ({ data: { message } })));
  }

  acceptPushNotification = async (user: any, notification_dto: any) => {
    await this.prisma.notificationToken.updateMany({
      where: { userId: user.id },
      data: {
        status: 'INACTIVE',
      },
    });
    // save to db
    const notification_token = await this.prisma.notificationToken.create({
      data: {
        userId: user.id,
        device_type: notification_dto.device_type,
        notification_token: notification_dto.notification_token,
      },
    });
    return notification_token;
  };

  disablePushNotification = async (
    user: any,
    update_dto: any,
  ): Promise<void> => {
    try {
      await this.prisma.notificationToken.updateMany({
        where: { userId: user.id, device_type: update_dto.device_type },
        data: { status: 'INACTIVE' },
      });
    } catch (error) {
      return error;
    }
  };

  getNotifications = async (): Promise<any> => {
    return await this.prisma.notification.findMany();
  };

  async sendPush(user: any, title: string, body: string): Promise<void> {
    try {
      const notification = await this.prisma.notificationToken.findFirst({
        where: { userId: user.id, status: 'ACTIVE' },
      });
      if (notification) {
        await this.prisma.notification.create({
          data: {
            notificationTokenId: notification.id,
            title,
            body,
            created_by: user.name,
          },
        });
        await firebase
          .messaging()
          .send({
            notification: { title, body },
            token: notification.notification_token,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
