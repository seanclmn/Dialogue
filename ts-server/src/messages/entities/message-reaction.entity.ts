import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/users/entities/user.entity';

// One row per (message, user, emoji): a user can react to the same message
// with several different emoji, but not with the same emoji twice.
@Entity()
@Index(['messageId', 'userId', 'emoji'], { unique: true })
@ObjectType()
export class MessageReaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 16 })
  @Field()
  emoji: string;

  @Column()
  messageId: string;

  @ManyToOne(() => Message, (message) => message.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  @Column()
  userId: string;

  // Eager + live (not denormalized) so a reactor's username/avatar always
  // reflects their current profile, unlike Message.username/userId which are
  // snapshotted at send time.
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
