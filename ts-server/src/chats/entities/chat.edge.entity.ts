import { ObjectType, Field } from '@nestjs/graphql';
import { Chat } from './chat.entity';

@ObjectType()
export class ChatEdge {
  @Field()
  cursor: string;

  @Field(() => Chat)
  node: Chat;
}
