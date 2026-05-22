import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Node } from 'src/relay';
import { Message } from 'src/messages/entities/message.entity';
import { ChatParticipant } from './chat-participant.entity';

@Entity()
@ObjectType({ implements: Node })
export class Chat implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @OneToMany(() => ChatParticipant, (cp) => cp.chat, { cascade: true })
  @Field(() => [ChatParticipant], { nullable: true })
  participants: ChatParticipant[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string | null;

  @OneToMany(() => Message, (message) => message.chat, { cascade: true })
  messages: Message[];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Message, { nullable: true })
  @OneToOne(() => Message, { nullable: true, eager: true })
  @JoinColumn()
  lastMessage: Message;

}
