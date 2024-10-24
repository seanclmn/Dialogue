import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';
import { CreateChatInput } from './create-chat.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => [User])
  participants: User[];

  @Column()
  @Field()
  name: String;
}
