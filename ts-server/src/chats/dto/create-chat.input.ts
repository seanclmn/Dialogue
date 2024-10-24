import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';

@InputType()
export class CreateChatInput {

  @Column()
  @Field(() => [User])
  participants: User[];

  @Column()
  @Field()
  name: String;

}
