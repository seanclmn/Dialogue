import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Node } from 'src/relay';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';

@Entity()
@ObjectType({ implements: Node })
export class Message implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column("longtext")
  @Field()
  text: string;

  @Column()
  @Field()
  userId: string;

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
