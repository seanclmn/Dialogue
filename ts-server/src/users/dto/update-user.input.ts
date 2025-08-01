import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ChatInput } from 'src/chats/dto/chatInput.input';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [ChatInput], { nullable: true })
  chats: ChatInput[]

}
