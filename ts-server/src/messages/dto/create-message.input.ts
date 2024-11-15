import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  text: string;

  @Field()
  userId: string;

  @Field()
  chatId: string;
}
