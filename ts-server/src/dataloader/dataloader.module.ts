import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '../friends/entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User])],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
