import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Node } from "src/relay";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum NotificationsType {
  FRIENDREQUEST = 'FriendRequest'
}

registerEnumType(NotificationsType, {
  name: 'NotificationsType',
});


@Entity()
@ObjectType({ implements: Node })
export class Notification implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sentRequests, { eager: true })
  sender: User

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.incomingRequests, { eager: true })
  receiver: User

  @Column()
  @Field(() => ID)
  receiverId: string;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => NotificationsType)
  @Column({
    type: 'enum',
    enum: NotificationsType,
  })
  type: NotificationsType;
}
