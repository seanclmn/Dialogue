import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from 'src/relay';
import { User } from 'src/users/entities/user.entity';


@Entity()
@ObjectType({ implements: Node })
export class Message implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  text: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages)
  user: User;
}
