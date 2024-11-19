import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from 'src/relay';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/messages/entities/message.entity';

@Entity()
@ObjectType({ implements: Node })
export class User implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  // @Field(() => [Chat], { nullable: true })
  @ManyToMany(() => Chat, (chat) => chat.participants, { eager: true })
  @JoinTable()
  chats: Chat[]

}
