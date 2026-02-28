import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, Friendship, User]),
    NotificationsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [FriendsService, FriendsResolver],
  exports: [FriendsService],
})
export class FriendsModule {}
