import { InputType, Field, ObjectType } from "@nestjs/graphql";
import { Message } from "src/messages/entities/message.entity";

@ObjectType()
export class ChatUpdate {
  @Field()
  chatId: string;

  @Field()
  newMessage: Message;

}