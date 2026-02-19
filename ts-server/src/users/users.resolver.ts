import { Resolver, Query, Mutation, Args, Int, Context, Parent, ResolveField } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { ChatConnection } from 'src/chats/entities/chat.connection.entity';
import { UserConnection } from './entities/user.connection.entity';
import { FriendRequest } from './entities/friendRequests.entity';
import { AcceptFriendRequestInput, DeclineFriendRequestInput, SendFriendRequestInput } from './dto/friendRequest.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationConnection } from 'src/notifications/entities/notification.connection';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) { }

  @Query(() => User)
  @UseGuards(JwtGuard)
  async currentUser(@Context() context: any) {
    const user = context.req.user;

    if (!user) {
      throw new UnauthorizedException('You are not authorized to view this profile');
    }
    const username = context.req.user.username;
    return await this.usersService.findOne(username)
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async sendFriendRequest(@Args('sendFriendRequestInput') friendRequestInput: SendFriendRequestInput) {
    return await this.usersService.sendFriendRequest(friendRequestInput.senderId, friendRequestInput.receiverId);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async acceptFriendRequest(@Args('acceptFriendRequestInput') friendRequestInput: AcceptFriendRequestInput) {
    return await this.usersService.acceptFriendRequest(friendRequestInput.friendRequestId);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async declineFriendRequest(@Args('declineFriendRequestInput') friendRequestInput: DeclineFriendRequestInput) {
    return await this.usersService.declineFriendRequest(friendRequestInput.friendRequestId);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.usersService.updateUser(updateUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtGuard)
  searchUsers(
    @Args('username', { type: () => String }) username: string
  ) {
    return this.usersService.searchUsers(username);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtGuard)
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.usersService.findOne(username);
  }

  @ResolveField('chats', () => ChatConnection)
  @UseGuards(JwtGuard)
  async chats(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: Date
  ): Promise<ChatConnection> {
    return await this.usersService.getChatsForUser(user.id, first, after);
  }

  @ResolveField('friends', () => UserConnection)
  @UseGuards(JwtGuard)
  async friends(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: number
  ): Promise<UserConnection> {
    return await this.usersService.getFriendsForUser(user.id, first, after);
  }

  @ResolveField('friendRequests', () => [FriendRequest])
  @UseGuards(JwtGuard)
  async friendRequests(
    @Parent() user: User,
  ): Promise<FriendRequest[]> {
    return await this.usersService.getFriendRequests(user.id);
  }

  @ResolveField("notifications", () => NotificationConnection)
  @UseGuards(JwtGuard)
  async notifications(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string
  ): Promise<NotificationConnection> {
    return await this.notificationsService.getNotificationsForUser(
      user.id,
      first || 10,
      after
    );
  }
}
