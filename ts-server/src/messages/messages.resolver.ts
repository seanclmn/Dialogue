import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent, Context, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { MessageReactionsUpdate } from './dto/message-reactions-update';
import { UseGuards, Inject } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { PUB_SUB } from 'src/redis/redis.module';
import { PubSub } from 'graphql-subscriptions';
import { DataloaderService } from 'src/dataloader/dataloader.service';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly dataloaderService: DataloaderService,
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

  @ResolveField('parentMessage', () => Message, { nullable: true })
  async parentMessage(@Parent() message: Message): Promise<Message | null> {
    if (!message.parentMessageId) return null;
    return this.dataloaderService.messageById(message.parentMessageId);
  }

  @ResolveField('reactions', () => [MessageReaction])
  async reactions(@Parent() message: Message): Promise<MessageReaction[]> {
    return this.dataloaderService.reactionsByMessageId(message.id);
  }

  @Mutation(() => Message)
  @UseGuards(JwtGuard)
  async addMessageReaction(
    @Args('messageId', { type: () => ID }) messageId: string,
    @Args('emoji') emoji: string,
    @Context() context: any,
  ): Promise<Message> {
    const userId = context.req.user.id;
    const message = await this.messagesService.addReaction(messageId, userId, emoji);
    await this.publishReactionsUpdated(message);
    return message;
  }

  @Mutation(() => Message)
  @UseGuards(JwtGuard)
  async removeMessageReaction(
    @Args('messageId', { type: () => ID }) messageId: string,
    @Args('emoji') emoji: string,
    @Context() context: any,
  ): Promise<Message> {
    const userId = context.req.user.id;
    const message = await this.messagesService.removeReaction(messageId, userId, emoji);
    await this.publishReactionsUpdated(message);
    return message;
  }

  @Subscription(() => MessageReactionsUpdate, {
    resolve: (payload: { reactionsUpdated: MessageReactionsUpdate }) => payload.reactionsUpdated,
    filter: (payload: { reactionsUpdated: MessageReactionsUpdate }, variables) =>
      variables.chatIds.includes(payload.reactionsUpdated.chatId),
  })
  reactionsUpdated(@Args('chatIds', { type: () => [ID!]! }) _chatIds: string[]) {
    return this.pubSub.asyncIterableIterator('reactionsUpdated');
  }

  private async publishReactionsUpdated(message: Message): Promise<void> {
    await this.pubSub.publish('reactionsUpdated', {
      reactionsUpdated: {
        chatId: message.chat.id,
        message,
      },
    });
  }
}
