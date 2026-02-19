import { Resolver, Query, Mutation, Args, Int, Subscription, ID } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

export const pubSub = new PubSub()

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) { }

  @Mutation(() => Message)
  @UseGuards(JwtGuard)
  async createMessage(@Args('createMessageInput') createMessageInput: CreateMessageInput) {
    const newMessage = await this.messagesService.create(createMessageInput);
    await pubSub.publish('newMessage', {
      messageAdded: {
        chatId: createMessageInput.chatId,
        newMessage: newMessage
      }
    })
    return newMessage
  }

  @Query(() => Message, { name: 'message' })
  @UseGuards(JwtGuard)
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.messagesService.findOne(id);
  }

  @Mutation(() => Message)
  @UseGuards(JwtGuard)
  updateMessage(@Args('updateMessageInput') updateMessageInput: UpdateMessageInput) {
    return this.messagesService.update(updateMessageInput);
  }

}