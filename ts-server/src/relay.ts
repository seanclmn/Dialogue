import { Field, ID, InterfaceType, ObjectType } from "@nestjs/graphql";

@InterfaceType()
export abstract class Node {
  @Field(() => ID)
  id: string
}

@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field()
  startCursor: string;

  @Field()
  endCursor: string;
}