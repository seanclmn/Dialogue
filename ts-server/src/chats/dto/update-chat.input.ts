import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';
import { CreateChatInput } from './create-chat.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { UserInput } from './userInput.input';
import { UpdateUserInput } from 'src/users/dto/update-user.input';

@InputType()
export class UpdateChatInput {
  @Field(() => ID)
  id: string;

  @Field(() => [UpdateUserInput])
  participants: UpdateUserInput[];

  @Column()
  @Field()
  name: string;
}
