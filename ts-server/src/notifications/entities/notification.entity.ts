import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  @Field()
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

  @Column({
    type: 'enum',
    enum: ["FriendRequest"],
    enumName: 'notification_type_enum', // Optional: specify a custom name for the database enum type
  })
  type: ["FriendRequest"];
}