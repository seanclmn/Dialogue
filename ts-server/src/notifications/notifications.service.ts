import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,

  ) { }

  async findAll(id: string) {
    return await this.notificationsRepository.find({
      where: {
        receiverId: id
      }
    })
  }

  async create(notification: Notification): Promise<Notification> {
    return await this.notificationsRepository.save(notification)
  }

  async getNotificationsForUser(userId: string, take: number, skip: number) {
    const [items, totalCount] = await this.notificationsRepository.findAndCount({
      where: { receiverId: userId },
      order: { createdAt: "DESC" },
      take: take,
      skip: skip,
    });

    return { items, totalCount };
  }
}
