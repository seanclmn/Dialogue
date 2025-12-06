import { ObjectType, Field } from '@nestjs/graphql'
import { PageInfo } from 'src/relay'
import { NotificationEdge } from './notification.edge'


@ObjectType()
export class NotificationConnection {
  @Field(() => [NotificationEdge])
  edges: NotificationEdge[]

  @Field(() => PageInfo)
  pageInfo: PageInfo
}