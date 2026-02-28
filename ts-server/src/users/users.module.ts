import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { FriendRequest } from './entities/friendRequests.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendRequest, Chat]),
    ChatsModule,
    NotificationsModule,
    forwardRef(() => FriendsModule),
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
