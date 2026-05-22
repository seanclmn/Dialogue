import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Node } from 'src/relay';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './chat.entity';
import { Message } from 'src/messages/entities/message.entity';

@Entity()
@ObjectType({ implements: Node })
export class ChatParticipant implements Node {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.participants, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @OneToOne(() => Message, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @Field(() => Message, { nullable: true })
  lastReadMessage: Message | null;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
