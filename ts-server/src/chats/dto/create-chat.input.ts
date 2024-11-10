import { InputType, Field } from '@nestjs/graphql';
import { UpdateUserInput } from 'src/users/dto/update-user.input';

@InputType()
export class CreateChatInput {
  @Field(() => [String])
  participants: string[];

  @Field()
  name: String;
}
