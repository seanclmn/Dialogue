import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatsService } from 'src/chats/chats.service';
import { MessagesService } from 'src/messages/messages.service';
import { Node } from 'src/relay';
import { ID } from '@nestjs/graphql';

@Resolver(() => Node)
export class NodeResolver {
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService
  ) { }

  @Query(() => Node, { nullable: true })
  async node(@Args('id', { type: () => ID! }) id: string) {
    const chat = await this.chatsService.findOne(id)
    if (chat) return chat

    const message = await this.messagesService.findOne(id)
    if (message) return message

    return null;
  }
}

