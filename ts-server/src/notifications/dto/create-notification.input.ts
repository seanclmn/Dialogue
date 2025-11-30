import { InputType } from "@nestjs/graphql";


@InputType()
export class CreateNotificationInput {
  type: string;
  senderId: string;
  receiverId: string;
  content: string;
}