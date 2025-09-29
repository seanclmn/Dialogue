import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

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
}
