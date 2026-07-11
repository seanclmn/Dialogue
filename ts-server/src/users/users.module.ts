import { Module } from '@nestjs/common';
import { StorageModule } from 'src/storage/storage.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { FriendRequest } from './entities/friendRequests.entity';
import { DataloaderModule } from 'src/dataloader/dataloader.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendRequest, Chat]),
    StorageModule,
    DataloaderModule,
  ],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
