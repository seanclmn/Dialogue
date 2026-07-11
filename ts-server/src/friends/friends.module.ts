import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { UserFriendsResolver } from './user-friends.resolver';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { DataloaderModule } from '../dataloader/dataloader.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, Friendship, User]),
    NotificationsModule,
    DataloaderModule,
  ],
  providers: [FriendsService, FriendsResolver, UserFriendsResolver],
  exports: [FriendsService],
})
export class FriendsModule {}
