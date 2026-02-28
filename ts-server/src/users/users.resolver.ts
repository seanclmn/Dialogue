import { Resolver, Query, Mutation, Args, Int, Context, Parent, ResolveField } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UnauthorizedException, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { ChatConnection } from 'src/chats/entities/chat.connection.entity';
import { UserConnection } from './entities/user.connection.entity';
import { AcceptFriendRequestInput, DeclineFriendRequestInput, SendFriendRequestInput } from '../friends/dto/friend-request.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationConnection } from 'src/notifications/entities/notification.connection';
import { FriendsService } from '../friends/friends.service';
import { FriendRequest as FriendRequestEntity } from '../friends/entities/friend-request.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly friendsService: FriendsService,
  ) { }

  @Query(() => User)
  @UseGuards(JwtGuard)
  async currentUser(@Context() context: any) {
    const user = context.req.user;

    if (!user) {
      throw new UnauthorizedException('You are not authorized to view this profile');
    }
    const username = context.req.user.username;
    const foundUser = await this.usersService.findOne(username);
    if (!foundUser) throw new NotFoundException(`User with username ${username} not found`);
    return foundUser;
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
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
  async findOne(@Args('username', { type: () => String }) username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException(`User with username ${username} not found`);
    return user;
  }

  @ResolveField('chats', () => ChatConnection)
  async chats(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: Date
  ): Promise<ChatConnection> {
    return await this.usersService.getChatsForUser(user.id, first, after);
  }

  @ResolveField('friends', () => UserConnection)
  async friends(
    @Parent() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: string
  ): Promise<UserConnection> {
    return await this.usersService.getFriendsForUser(user.id, first, parseInt(after || '0'));
  }

  @ResolveField('friendRequests', () => [FriendRequestEntity])
  async friendRequests(
    @Parent() user: User,
  ): Promise<FriendRequestEntity[]> {
    return await this.friendsService.getFriendRequests(user.id);
  }

  @ResolveField("notifications", () => NotificationConnection)
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
