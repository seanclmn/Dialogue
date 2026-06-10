import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { UseGuards, Inject } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { PUB_SUB } from 'src/redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) { }

  @Mutation(() => Message)
  @UseGuards(JwtGuard)
  async createMessage(@Args('createMessageInput') createMessageInput: CreateMessageInput) {
    const newMessage = await this.messagesService.create(createMessageInput);
    await this.pubSub.publish('newMessage', {
      messageAdded: {
        chatId: createMessageInput.chatId,
        newMessage: newMessage
      }
    });
    return newMessage;
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
