import { Resolver, Query, Mutation, Args, Int, Subscription, ID } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { PubSub } from 'graphql-subscriptions';

export const pubSub = new PubSub()

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) { }

  @Mutation(() => Message)
  async createMessage(@Args('createMessageInput') createMessageInput: CreateMessageInput) {
    const newMessage = await this.messagesService.create(createMessageInput);
    await pubSub.publish('newMessage', { messageAdded: newMessage })
    return newMessage
  }

  @Query(() => Message, { name: 'message' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.messagesService.findOne(id);
  }

  @Mutation(() => Message)
  updateMessage(@Args('updateMessageInput') updateMessageInput: UpdateMessageInput) {
    return this.messagesService.update(updateMessageInput);
  }

  @Subscription(() => Message, {
    resolve: (payload) => payload.messageAdded,
    filter: (payload, variables) => variables.chatId.includes(payload.messageAdded.chat.id),
  })
  addMessage(@Args('chatIds', { type: () => [ID] }) chatIds: string[]) {
    return pubSub.asyncIterableIterator('newMessage')
  }
}