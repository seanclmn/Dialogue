import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Node } from "src/relay";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType({ implements: Node })
export class Notification implements Node {
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

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ["FriendRequest"],
    enumName: 'notification_type_enum', // Optional: specify a custom name for the database enum type
  })
  type: ["FriendRequest"];
}