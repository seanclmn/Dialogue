import { InputType, Field, ID } from '@nestjs/graphql';
import { ChatInput } from 'src/chats/dto/chatInput.input';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [ChatInput], { nullable: true })
  chats: ChatInput[]

}
