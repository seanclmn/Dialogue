import { InputType, Field } from '@nestjs/graphql';
import { UserInput } from './userInput.input';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateChatInput {
  @Field(() => [UserInput])
  participants: UserInput[];

  @Field()
  name: String;
}
