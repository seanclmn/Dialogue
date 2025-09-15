import { Field, ID, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class TypingEventOutput {
  @Field(() => ID)
  chatId: string

  @Field()
  userId: string

  @Field()
  isTyping: boolean
}