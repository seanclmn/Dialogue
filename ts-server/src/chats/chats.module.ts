import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';
import { TypingEvent } from './events/typing.event';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Chat]), forwardRef(() => MessagesModule)],
  providers: [ChatsResolver, ChatsService, TypingEvent],
  exports: [ChatsService]
})
export class ChatsModule { }
