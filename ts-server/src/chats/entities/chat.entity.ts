import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from 'src/relay';

@Entity()
@ObjectType({ implements: Node })
export class Chat implements Node {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => [User])
  participants: User[];

  @Column()
  @Field()
  name: String;

}
