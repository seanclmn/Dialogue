import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class EditProfileInput {
  @Field()
  username: string;

  @Field({ nullable: true })
  bio?: string;
}