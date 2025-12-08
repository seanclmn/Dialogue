import { InputType } from "@nestjs/graphql";
import { CreateNotificationInput } from "./create-notification.input";

@InputType()
export class CreateFriendRequestInput extends CreateNotificationInput { }