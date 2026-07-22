import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from '../entities/message.entity';

@ObjectType()
export class MessageReactionsUpdate {
  @Field()
  chatId: string;

  @Field(() => Message)
  message: Message;
}
