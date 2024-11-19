import { ObjectType, Field } from '@nestjs/graphql';
import { ChatEdge } from './chat.edge.entity';
import { PageInfo } from 'src/relay';

@ObjectType()
export class ChatConnection {
  @Field(() => [ChatEdge])
  edges: ChatEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

