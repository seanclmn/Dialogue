import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { NotificationsType, Notification } from './entities/notification.entity';
import { UsersService } from 'src/users/users.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { CreateNotificationParams } from './inputs/create-notification.input';

@Resolver()
export class NotificationsResolver {

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService
  ) { }

  @Query(() => [Notification], { name: 'notifications' })
  findAll(@Args('userId', { type: () => ID }) userId: string) {
    return this.notificationsService.findAll(userId)
  }

  @Mutation(() => Notification)
  async createFriendRequest(@Args('createFriendRequestInput') createFriendRequestInput: CreateNotificationInput) {
    const { senderId, type, receiverId } = createFriendRequestInput

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
