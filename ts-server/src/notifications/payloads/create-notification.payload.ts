import { InputType } from "@nestjs/graphql";

@InputType()
export class CreateNotificationPayload {
  type: string;
  senderId: string;
  receiverId: string;
  content: string;
}