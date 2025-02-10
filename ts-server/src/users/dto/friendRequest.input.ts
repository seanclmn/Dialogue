import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class SendFriendRequestInput {
  @Field()
  senderId: string;

  @Field()
  receiverId: string;
}

@InputType()
export class AcceptFriendRequestInput {
  @Field()
  friendRequestId: string;
}

@InputType()
export class DeclineFriendRequestInput {
  @Field()
  friendRequestId: string;
}