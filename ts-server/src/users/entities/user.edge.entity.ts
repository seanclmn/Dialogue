import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class UserEdge {
  @Field()
  cursor: string;

  @Field(() => User)
  node: User;
}
