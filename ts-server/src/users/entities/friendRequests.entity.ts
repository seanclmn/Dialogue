import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
@ObjectType()
export class FriendRequest {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string

  @ManyToOne(() => User, (user) => user.sentRequests)
  sender: User

  @ManyToOne(() => User, (user) => user.incomingRequests)
  receiver: User

}