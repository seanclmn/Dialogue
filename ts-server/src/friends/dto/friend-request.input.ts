import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SendFriendRequestInput {
  @Field(() => String)
  senderId: string;

  @Field(() => String)
  receiverId: string;
}

@InputType()
export class AcceptFriendRequestInput {
  @Field(() => ID)
  friendRequestId: string;
}

@InputType()
export class DeclineFriendRequestInput {
  @Field(() => ID)
  friendRequestId: string;
}
