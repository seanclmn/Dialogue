import { Field, ObjectType, ID } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Node } from "../../relay";

@Entity()
@ObjectType({ implements: Node })
export class FriendRequest implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sentRequests, { eager: true })
  sender: User

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.incomingRequests, { eager: true })
  receiver: User

  @Column({ default: false })
  @Field(() => Boolean)
  accepted: boolean

  @Column({ default: false })
  @Field(() => Boolean)
  declined: boolean

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
