import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FriendsService } from './friends.service';
import { FriendRequest } from './entities/friend-request.entity';
import { SendFriendRequestInput, AcceptFriendRequestInput, DeclineFriendRequestInput } from './dto/friend-request.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Resolver(() => FriendRequest)
@UseGuards(JwtGuard)
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  @Mutation(() => FriendRequest)
  async sendFriendRequest(
    @Args('sendFriendRequestInput') input: SendFriendRequestInput,
  ) {
    const request = await this.friendsService.sendFriendRequest(input.senderId, input.receiverId);
    return request;
  }

  @Mutation(() => FriendRequest)
  async acceptFriendRequest(
    @Args('acceptFriendRequestInput') input: AcceptFriendRequestInput,
  ) {
    return this.friendsService.acceptFriendRequest(input.friendRequestId);
  }

  @Mutation(() => FriendRequest)
  async declineFriendRequest(
    @Args('declineFriendRequestInput') input: DeclineFriendRequestInput,
  ) {
    return this.friendsService.declineFriendRequest(input.friendRequestId);
  }
}
