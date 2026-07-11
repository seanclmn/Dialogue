import { Resolver, ResolveField, Parent, Args, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { NotificationsService } from './notifications.service';
import { NotificationConnection } from './entities/notification.connection';

@Resolver(() => User)
export class UserNotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ResolveField('notifications', () => NotificationConnection)
  async notifications(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string,
  ): Promise<NotificationConnection> {
    return this.notificationsService.getNotificationsForUser(
      user.id,
      first ?? 10,
      after,
    );
  }
}
