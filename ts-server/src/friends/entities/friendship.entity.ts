import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Node } from "../../relay";

@Entity()
@Unique(["user", "friend"])
@ObjectType({ implements: Node })
export class Friendship implements Node {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @Field(() => User)
  friend: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
