import { InputType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";


@InputType()
export class CreateNotificationInput {
  type: string;
  sender: User
  receiver: User
  receiverId: string
}

// export class CreateNotificationInput {
//   type: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
// }