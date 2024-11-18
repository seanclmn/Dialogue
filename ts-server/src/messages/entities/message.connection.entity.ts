import { ObjectType, Field } from '@nestjs/graphql';
import { MessageEdge } from './message.edge.entity';
import { PageInfo } from 'src/relay';

@ObjectType()
export class MessageConnection {
  @Field(() => [MessageEdge])
  edges: MessageEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

