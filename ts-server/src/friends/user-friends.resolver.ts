import { Resolver, ResolveField, Parent, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserConnection } from 'src/users/entities/user.connection.entity';
import { UserEdge } from 'src/users/entities/user.edge.entity';
import { PageInfo } from 'src/relay';
import { FriendsService } from './friends.service';
import { FriendRequest } from './entities/friend-request.entity';
import { DataloaderService } from 'src/dataloader/dataloader.service';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => User)
export class UserFriendsResolver {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly dataloaderService: DataloaderService,
  ) {}

  @ResolveField('friends', () => UserConnection)
  async friends(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: string,
  ): Promise<UserConnection> {
    const friends = await this.friendsService.getFriends(user.id);

    const start = after
      ? parseInt(Buffer.from(after, 'base64').toString('ascii')) + 1
      : 0;
    const limit = first ?? 10;
    const paginatedFriends = friends.slice(start, start + limit);

    const edges: UserEdge[] = paginatedFriends.map((friend, index) => ({
      cursor: Buffer.from((start + index).toString()).toString('base64'),
      node: friend,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor ?? '',
      endCursor: edges[edges.length - 1]?.cursor ?? '',
      hasPreviousPage: start > 0,
      hasNextPage: friends.length > start + limit,
    };

    return { edges, pageInfo };
  }

  @ResolveField('friendRequests', () => [FriendRequest])
  async friendRequests(@Parent() user: User): Promise<FriendRequest[]> {
    return this.friendsService.getFriendRequestsForUser(user.id);
  }

  @ResolveField('isFriend', () => Boolean)
  @UseGuards(JwtGuard)
  async isFriend(
    @Parent() user: User,
    @Context() context: any,
  ): Promise<boolean> {
    const currentUser = context.req.user;
    if (!currentUser || currentUser.id === user.id) return false;
    return this.dataloaderService.isFriend(currentUser.id, user.id);
  }
}
