import { InputType } from "@nestjs/graphql";
import { NotificationsType } from "../entities/notification.entity";

@InputType()
export class CreateNotificationInput {
  senderId: string;
  receiverId: string;
  type: NotificationsType
}