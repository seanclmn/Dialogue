import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsType } from '../notifications/entities/notification.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestsRepository: Repository<FriendRequest>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
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
      friendRequestId: newFriendRequest.id,
    } as any);

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

    if (friendRequest.accepted) {
      return friendRequest;
    }

    const { sender, receiver } = friendRequest;

    // Check if friendship already exists to avoid duplicate entry errors
    const alreadyFriends = await this.isFriend(sender.id, receiver.id);
    
    if (!alreadyFriends) {
      // Create bidirectional friendship entries
      await this.friendshipRepository.save([
        { user: sender, friend: receiver },
        { user: receiver, friend: sender },
      ]);
    }

    friendRequest.accepted = true;
    const savedRequest = await this.friendRequestsRepository.save(friendRequest);

    // Delete notification when request is accepted
    await this.notificationsService.deleteFriendRequestNotification(sender.id, receiver.id);
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

    if (friendRequest.declined) {
      return friendRequest;
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

  async getFriendRequestsForUser(userId: string) {
    return await this.friendRequestsRepository.find({
      where: [
        { receiver: { id: userId }, accepted: false, declined: false },
        { sender: { id: userId }, accepted: false, declined: false },
      ],
      relations: ['sender', 'receiver'],
    });
  }

  async getFriends(userId: string) {
    const friendships = await this.friendshipRepository.find({
      where: { user: { id: userId } },
      relations: ['friend'],
    });
    console.log(`Friends for ${userId}:`, friendships.map(f => f.friend.username));
    return friendships.map(f => f.friend);
  }

  async isFriend(userId: string, friendId: string): Promise<boolean> {
    if (!userId || !friendId) return false;
    const count = await this.friendshipRepository.count({
      where: { user: { id: userId }, friend: { id: friendId } },
    });
    console.log(`Is ${userId} friend with ${friendId}?`, count > 0);
    return count > 0;
  }
}
