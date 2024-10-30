import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';
import { CreateChatInput } from './create-chat.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { UserInput } from './userInput.input';

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field(() => ID)
  id: string;

  @Field(() => [UserInput])
  participants: UserInput[];

  @Column()
  @Field()
  name: String;
}
