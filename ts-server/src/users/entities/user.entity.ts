import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from 'src/relay';
import { Chat } from 'src/chats/entities/chat.entity';
import { FriendRequest as FriendRequestEntity } from "src/friends/entities/friend-request.entity";
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

  // @Column()
  // hashedRefreshToken?: string;

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

  @OneToMany(() => FriendRequestEntity, (friendRequest) => friendRequest.sender, { nullable: true })
  @Field(() => [FriendRequestEntity], { nullable: true })
  sentRequests: FriendRequestEntity[]

  @OneToMany(() => FriendRequestEntity, (friendRequest) => friendRequest.receiver, { nullable: true })
  @Field(() => [FriendRequestEntity], { nullable: true })
  incomingRequests: FriendRequestEntity[]

  @Field(() => NotificationConnection, { nullable: true })
  notifications: NotificationConnection

}
