import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { DataloaderModule } from 'src/dataloader/dataloader.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat, User]), DataloaderModule],
  providers: [MessagesResolver, MessagesService],
  exports: [MessagesService]
})
export class MessagesModule { }
