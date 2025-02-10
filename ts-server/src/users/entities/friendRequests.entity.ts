import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
@ObjectType()
export class FriendRequest {
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
  @Field(() => Boolean)
  accepted: boolean

  @Column()
  @Field(() => Boolean)
  declined: boolean

}