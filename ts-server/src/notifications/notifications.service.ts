import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationConnection } from './entities/notification.connection';
import { LessThan, Repository } from 'typeorm';
import { CreateNotificationParams } from './inputs/create-notification.input';
import { NotificationEdge } from './entities/notification.edge';
import { PageInfo } from 'src/relay';
import { Notification, NotificationsType, FriendRequestNotification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
    @InjectRepository(FriendRequestNotification) private friendRequestNotificationsRepository: Repository<FriendRequestNotification>,
  ) { }

  async findAll(id: string) {
    const res = await this.notificationsRepository.find({
      where: {
        receiverId: id
      }
    })
    return res
  }

  async create(createNotificationInput: CreateNotificationParams) {
    if (createNotificationInput.type === NotificationsType.FRIENDREQUEST) {
      return await this.friendRequestNotificationsRepository.save(createNotificationInput as any);
    }
    return await this.notificationsRepository.save(createNotificationInput as any);
  }

  async getNotificationsForUser(
    userId: string,
    first: number,
    after?: string
  ): Promise<NotificationConnection> {
    const afterDate = after ? new Date(Buffer.from(after, 'base64').toString('ascii')) : undefined;
    const where = afterDate
      ? { receiverId: userId, createdAt: LessThan(afterDate) }
      : { receiverId: userId };

    const notifications = await this.notificationsRepository.find({
      where,
      order: { createdAt: "DESC" },
      take: first + 1,
    });

    const requestedNotifications = notifications.slice(0, first);
    const hasNextPage = notifications.length > first;

    const edges: NotificationEdge[] = requestedNotifications.map((notification) => ({
      cursor: Buffer.from(notification.createdAt.toISOString()).toString('base64'),
      node: notification,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
      hasPreviousPage: !!after,
      hasNextPage,
    };

    return { edges, pageInfo };
  }

  async deleteFriendRequestNotification(senderId: string, receiverId: string) {
    await this.friendRequestNotificationsRepository.delete({
      sender: { id: senderId },
      receiverId: receiverId,
      type: NotificationsType.FRIENDREQUEST,
    });
  }
}
