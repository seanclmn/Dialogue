import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from 'src/relay';

@Entity()
@ObjectType({ implements: Node })
export class Chat implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.chats, { cascade: true, eager: true })
  @JoinTable()
  participants: User[];

  @Column()
  @Field()
  name: String;

}
