import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat]), MessagesModule],
  providers: [ChatsResolver, ChatsService],
  exports: [ChatsService]
})
export class ChatsModule { }
