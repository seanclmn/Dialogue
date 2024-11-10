import { InputType, Field, ID } from '@nestjs/graphql';
import { UpdateUserInput } from 'src/users/dto/update-user.input';

@InputType()
export class ChatInput {
  @Field(() => ID)
  id: string;

  @Field(() => [UpdateUserInput])
  participants: UpdateUserInput[];

  @Field()
  name: String;
}
