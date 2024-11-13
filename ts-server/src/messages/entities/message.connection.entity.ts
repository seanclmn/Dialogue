import { ObjectType, Field } from '@nestjs/graphql';
import { MessageEdge } from './message.edge.entity';

@ObjectType()
export class PageInfo {
  @Field()
  endCursor: string;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class MessageConnection {
  @Field(() => [MessageEdge])
  edges: MessageEdge[];

  @Field()
  pageInfo: PageInfo;
}