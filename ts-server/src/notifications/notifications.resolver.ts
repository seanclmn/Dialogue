import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@Resolver()
export class NotificationsResolver {

  constructor(
    private notificationsService: NotificationsService
  ) { }

  @Query(() => [Notification], { name: 'notifications' })
  findAll(@Args('userId', { type: () => ID }) userId: string) {
    return this.notificationsService.findAll(userId)
  }

}
