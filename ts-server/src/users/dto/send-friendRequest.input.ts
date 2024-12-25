import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class FriendRequestInput {
  @Field()
  senderId: string;

  @Field()
  receiverId: string;
}