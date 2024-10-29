import { InputType, Field } from '@nestjs/graphql';
import { UserInput } from './userInput.input';

@InputType()
export class CreateChatInput {
  @Field(() => [UserInput])
  participants: UserInput[];

  @Field()
  name: String;
}
