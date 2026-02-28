import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsType } from '../notifications/entities/notification.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestsRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async sendFriendRequest(senderId: string, receiverId: string) {
    const sender = await this.usersRepository.findOne({ where: { id: senderId } });
    const receiver = await this.usersRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    const newFriendRequest = await this.friendRequestsRepository.save({
      sender,
      receiver,
      accepted: false,
      declined: false,
    });

    // Create notification
    await this.notificationsService.create({
      sender,
      receiver,
      type: NotificationsType.FRIENDREQUEST,
    });

    return newFriendRequest;
  }

  async acceptFriendRequest(friendRequestId: string) {
    const friendRequest = await this.friendRequestsRepository.findOne({
      where: { id: friendRequestId },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) {
      throw new NotFoundException(`Friend request with ID ${friendRequestId} not found`);
    }

    const { sender, receiver } = friendRequest;

    // Add to friends list for both
    await this.usersRepository.createQueryBuilder()
      .relation(User, 'friends')
      .of(sender)
      .add(receiver);

    await this.usersRepository.createQueryBuilder()
      .relation(User, 'friends')
      .of(receiver)
      .add(sender);

    friendRequest.accepted = true;
    const savedRequest = await this.friendRequestsRepository.save(friendRequest);

    // Delete notification when request is accepted
    await this.notificationsService.deleteFriendRequestNotification(sender.id, receiver.id);

    // Also delete the notification for the receiver if it exists
    await this.notificationsService.deleteFriendRequestNotification(receiver.id, sender.id);

    return savedRequest;
  }

  async declineFriendRequest(friendRequestId: string) {
    const friendRequest = await this.friendRequestsRepository.findOne({
      where: { id: friendRequestId },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) {
      throw new NotFoundException(`Friend request with ID ${friendRequestId} not found`);
    }

    const { sender, receiver } = friendRequest;

    friendRequest.declined = true;
    const savedRequest = await this.friendRequestsRepository.save(friendRequest);

    // Delete notification when request is declined
    await this.notificationsService.deleteFriendRequestNotification(sender.id, receiver.id);
    await this.notificationsService.deleteFriendRequestNotification(receiver.id, sender.id);

    return savedRequest;
  }

  async getFriendRequests(userId: string) {
    return await this.friendRequestsRepository.find({
      where: { receiver: { id: userId }, accepted: false, declined: false },
      relations: ['sender'],
    });
  }
}
