import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationInput } from './dto/inputs/create-notification.input';
type GetNotificationsForUser = {
  items: Notification[];
  totalCount: number;
}
@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
  ) { }

  async findAll(id: string) {
    const res = await this.notificationsRepository.find({
      where: {
        receiverId: id
      }
    })
    return res
  }

  async create(notification: CreateNotificationInput): Promise<Notification> {
    return await this.notificationsRepository.save(notification)
  }

  async getNotificationsForUser(userId: string, take: number, skip: number): Promise<GetNotificationsForUser> {

    const [items, totalCount] = await this.notificationsRepository.findAndCount({
      where: { receiverId: userId },
      order: { createdAt: "DESC" },
      take: take,
      skip: skip,
    });

    console.log(totalCount)
    return { items, totalCount };
  }
}
