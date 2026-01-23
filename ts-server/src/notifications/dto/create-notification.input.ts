import { Field, InputType } from "@nestjs/graphql";
import { NotificationsType } from "../entities/notification.entity";

@InputType()
export class CreateNotificationInput {
  @Field()
  senderId: string;

  @Field()
  receiverId: string;

  @Field(() => NotificationsType)
  type: NotificationsType
}
