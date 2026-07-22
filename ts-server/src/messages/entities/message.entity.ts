import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Node } from 'src/relay';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { MessageReaction } from './message-reaction.entity';

@Entity()
@ObjectType({ implements: Node })
export class Message implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column("longtext")
  @Field()
  text: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  @Field({ nullable: true })
  gifUrl?: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  gifWidth?: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  gifHeight?: number;

  @Column()
  @Field()
  userId: string;

  @Column()
  @Field()
  username: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  @Field(() => ID, { nullable: true })
  parentMessageId?: string | null;

  // Resolved on demand by MessagesResolver.parentMessage (batched via DataloaderService)
  // rather than being a TypeORM relation, since it's derived from parentMessageId.
  @Field(() => Message, { nullable: true })
  parentMessage?: Message | null;

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  // Resolved on demand by MessagesResolver.reactions (batched via DataloaderService)
  // rather than eager-loaded here, so it doesn't interfere with the messages
  // connection's skip/take pagination.
  @OneToMany(() => MessageReaction, (reaction) => reaction.message)
  @Field(() => [MessageReaction])
  reactions: MessageReaction[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
