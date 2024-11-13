import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from './message.entity';

@ObjectType()
export class MessageEdge {
  @Field()
  cursor: string;

  @Field(() => Message)
  node: Message;
}
