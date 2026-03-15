import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  text: string;

  @Field()
  userId: string;

  @Field()
  chatId: string;

  @Field({ nullable: true })
  gifUrl?: string;

  @Field(() => Int, { nullable: true })
  gifWidth?: number;

  @Field(() => Int, { nullable: true })
  gifHeight?: number;
}
