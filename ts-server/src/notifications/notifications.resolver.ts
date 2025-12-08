import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationPayload } from './dto/payloads/create-notification.payload';
import { CreateFriendRequestInput } from './dto/inputs/create-friendrequest.input';
import { UsersService } from 'src/users/users.service';

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

  // @Mutation(() => Notification)
  // createFriendRequest(@Args('createFriendRequestInput') createFriendRequestInput: CreateFriendRequestInput) {
  //   const { senderId, type, receiverId, content } = createFriendRequestInput

  //   const sender = this.usersService.findOne(senderId)
  //   const receiver = this.usersService.findOne(receiverId)


  //   const newNotification: CreateFriendRequestInput = {
  //     senderId: senderId,
  //     receiverId: receiverId,

  //   }

  //   return this.notificationsService.create(newNotification)
  // }
}
