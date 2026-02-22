import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { NotificationsType, Notification } from './entities/notification.entity';
import { UsersService } from 'src/users/users.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { CreateNotificationParams } from './inputs/create-notification.input';
import { NotificationConnection } from './entities/notification.connection';

@Resolver()
export class NotificationsResolver {

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService
  ) { }

  @Query(() => NotificationConnection, { name: 'notifications' })
  findAll(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('first', { type: () => Int, defaultValue: 10 }) first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string
  ) {
    return this.notificationsService.getNotificationsForUser(userId, first, after)
  }

  @Mutation(() => Notification)
  async createFriendRequest(@Args('createFriendRequestInput') createFriendRequestInput: CreateNotificationInput) {
    const { senderId, receiverId } = createFriendRequestInput

    const sender = await this.usersService.findOne(senderId)
    const receiver = await this.usersService.findOne(receiverId)

    const newNotification: CreateNotificationParams = {
      sender: sender,
      receiver: receiver,
      type: NotificationsType.FRIENDREQUEST,
    }

    return this.notificationsService.create(newNotification)
  }
}
