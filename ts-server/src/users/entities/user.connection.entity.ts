import { ObjectType, Field } from '@nestjs/graphql';
import { PageInfo } from 'src/relay';
import { UserEdge } from './user.edge.entity';

@ObjectType()
export class UserConnection {
  @Field(() => [UserEdge])
  edges: UserEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

