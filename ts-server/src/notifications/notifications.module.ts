import { forwardRef, Module } from '@nestjs/common';
import { NotificationsResolver } from './notifications.resolver';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, FriendRequestNotification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, FriendRequestNotification]), forwardRef(() => UsersModule)],
  providers: [NotificationsService, NotificationsResolver],
  exports: [NotificationsService]
})
export class NotificationsModule { }
