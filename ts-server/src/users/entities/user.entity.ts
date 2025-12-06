import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from 'src/relay';
import { Chat } from 'src/chats/entities/chat.entity';
import { FriendRequest } from './friendRequests.entity';
import { Notification } from 'src/notifications/entities/notification.entity'
import { NotificationConnection } from 'src/notifications/entities/notification.connection';

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

  @Column("longtext", { nullable: true })
  @Field({ nullable: true })
  bio?: string;

  @Column()
  hashedRefreshToken?: string;

  // @Field(() => [Chat], { nullable: true })
  @ManyToMany(() => Chat, (chat) => chat.participants, { eager: true })
  @JoinTable()
  chats: Chat[]

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'friends',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' },
  })
  friends: User[]

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, { nullable: true })
  sentRequests: FriendRequest[]

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, { nullable: true })
  incomingRequests: FriendRequest[]

  @Field(() => NotificationConnection, { nullable: true })
  notifications: NotificationConnection

}
