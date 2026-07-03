import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationConnection } from './entities/notification.connection';
import { LessThan, Repository } from 'typeorm';
import { CreateNotificationParams } from './inputs/create-notification.input';
import { NotificationEdge } from './entities/notification.edge';
import { PageInfo } from 'src/relay';
import { Notification, NotificationsType, FriendRequestNotification } from './entities/notification.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const NOTIFS_CACHE_TTL_MS = 60_000;

@Injectable()
export class NotificationsService {
  private readonly userNotifKeys = new Map<string, Set<string>>();

  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
    @InjectRepository(FriendRequestNotification) private friendRequestNotificationsRepository: Repository<FriendRequestNotification>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
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
    let result: Notification;
    if (createNotificationInput.type === NotificationsType.FRIENDREQUEST) {
      result = await this.friendRequestNotificationsRepository.save(createNotificationInput as any);
    } else {
      result = await this.notificationsRepository.save(createNotificationInput as any);
    }
    await this.invalidateUserNotifications(createNotificationInput.receiver.id);
    return result;
  }

  async getNotificationsForUser(
    userId: string,
    first: number,
    after?: string
  ): Promise<NotificationConnection> {
    const cacheKey = `notifs:user:${userId}:${first}:${after ?? ''}`;
    const cached = await this.cache.get<NotificationConnection>(cacheKey);
    if (cached) return cached;

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

    const result = { edges, pageInfo };
    await this.cache.set(cacheKey, result, NOTIFS_CACHE_TTL_MS);
    if (!this.userNotifKeys.has(userId)) this.userNotifKeys.set(userId, new Set());
    this.userNotifKeys.get(userId).add(cacheKey);
    return result;
  }

  async deleteFriendRequestNotification(senderId: string, receiverId: string) {
    await this.friendRequestNotificationsRepository.delete({
      sender: { id: senderId },
      receiverId: receiverId,
      type: NotificationsType.FRIENDREQUEST,
    });
    await this.invalidateUserNotifications(receiverId);
  }

  private async invalidateUserNotifications(userId: string): Promise<void> {
    const keys = this.userNotifKeys.get(userId);
    if (!keys?.size) return;
    await Promise.all([...keys].map((k) => this.cache.del(k)));
    this.userNotifKeys.delete(userId);
  }
}
