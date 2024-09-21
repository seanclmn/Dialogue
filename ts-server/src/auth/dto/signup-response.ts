import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';


@ObjectType()
export class SignupResponse {
  @Field()
  accessToken: string;

  @Field()
  password: string;

  @Field(() => User)
  user: User;
}
