import { Resolver, Query, Mutation, Args, Int, Context, ID, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { ChatsService, CreateChatFuncInput } from './chats.service';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { MessagesService } from 'src/messages/messages.service';
import { MessageConnection } from 'src/messages/entities/message.connection.entity';
import { ChatUpdate } from './dto/chatUpdate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypingEvent } from './events/typing.event';
import { TypingEventOutput } from './dto/typingEvent';
import { PUB_SUB } from 'src/redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private usersService: UsersService,
    private messagesService: MessagesService,
    private eventEmitter: EventEmitter2,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {
    this.eventEmitter.on('chat.typing', (event: TypingEvent) => {
      this.pubSub.publish('userTyping', { userTyping: event });
    });
  }


  @Mutation(() => Chat)
  @UseGuards(JwtGuard)
  async createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Context() _context: any
  ) {

    const participantObjects: User[] = (
      await Promise.all(
        createChatInput.participants.map((username) => this.usersService.findOne(username)),
      )
    ).filter((u): u is User => u != null);

    if (participantObjects.length === 2) {
      const existingDM = await this.chatsService.findExistingDM(
        participantObjects[0].id,
        participantObjects[1].id,
      );
      if (existingDM) return existingDM;
    }

    const input: CreateChatFuncInput = {
      ...createChatInput,
      participants: [...participantObjects]
    }

    const res = await this.chatsService.create(input);

    return res;

  }

  @Query(() => [Chat], { name: 'chats' })
  @UseGuards(JwtGuard)
  findAll() {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
  @UseGuards(JwtGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat)
  @UseGuards(JwtGuard)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput);
  }

  @Mutation(() => Chat)
  @UseGuards(JwtGuard)
  removeChat(@Args('id', { type: () => Int }) id: string) {
    return this.chatsService.remove(id);
  }

  @Mutation(() => ChatParticipant)
  @UseGuards(JwtGuard)
  async markLastRead(
    @Args('chatId', { type: () => ID }) chatId: string,
    @Args('messageId', { type: () => ID }) messageId: string,
    @Context() context: any,
  ): Promise<ChatParticipant> {
    const userId: string = context.req.user.id;
    return this.chatsService.markLastRead(userId, chatId, messageId);
  }

  @ResolveField('messages', () => MessageConnection)
  @UseGuards(JwtGuard)
  async messages(
    @Parent() chat: Chat,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: string
  ): Promise<MessageConnection> {
    return await this.messagesService.getMessagesForChat(chat.id, first, after);
  }

  @Subscription(() => ChatUpdate, {
    resolve: (payload: { messageAdded: ChatUpdate }) => payload.messageAdded,
    filter: (payload: { messageAdded: ChatUpdate }, variables) => variables.chatIds.includes(payload.messageAdded.chatId),
  })
  newMessage(@Args('chatIds', { type: () => [ID!]! }) _chatIds: string[]) {
    return this.pubSub.asyncIterator('newMessage')
  }

  @Mutation(() => TypingEventOutput)
  @UseGuards(JwtGuard)
  updateTyping(
    @Args('chatId') chatId: string,
    @Args('userId') userId: string,
    @Args('isTyping') isTyping: boolean,
  ) {
    const typingStateObj = new TypingEvent(chatId, userId, isTyping)

    this.eventEmitter.emit(
      'chat.typing',
      typingStateObj
    );

    return typingStateObj;
  }

  @Subscription(() => TypingEventOutput, {
    filter: (payload, variables) => {
      return payload.userTyping.chatId === variables.chatId;
    },
    resolve: (payload) => payload.userTyping,
  })
  userTyping(@Args('chatId', { type: () => ID }) _chatId: string) {
    return this.pubSub.asyncIterator('userTyping');
  }
}
