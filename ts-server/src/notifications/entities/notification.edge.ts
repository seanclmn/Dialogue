import { Field, ObjectType } from "@nestjs/graphql";
import { Notification } from "./notification.entity";


@ObjectType()
export class NotificationEdge {
  @Field()
  cursor: string;

  @Field(() => Notification)
  node: Notification;
}