import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { ChatsService } from 'src/chats/chats.service';
import { FriendRequest } from './entities/friendRequests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, FriendRequest])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
