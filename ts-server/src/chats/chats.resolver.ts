import { Resolver, Query, Mutation, Args, Int, Context, ID, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { ChatsService, CreateChatFuncInput } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { MessagesService } from 'src/messages/messages.service';
import { MessageConnection } from 'src/messages/entities/Message.Connection.entity';
import { ChatUpdate } from './dto/chatUpdate';
import { pubSub } from 'src/messages/messages.resolver';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypingEvent } from './events/typing.event';
import { TypingEventOutput } from './dto/typingEvent';
@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService,
    private usersService: UsersService,
    private messagesService: MessagesService,
    private eventEmitter: EventEmitter2,
    private typingState: TypingEvent
  ) {
    this.typingState = {
      chatId: null,
      userId: null,
      isTyping: false
    }
    this.eventEmitter.on('chat.typing', (event: TypingEvent) => {
      pubSub.publish('USER_TYPING', { userTyping: event });
    });
  }


  @Mutation(() => Chat)
  @UseGuards(JwtGuard)
  async createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Context() context: any
  ) {

    const participantObjects: UpdateUserInput[] = await Promise.all(createChatInput.participants.map(async (username) => {
      return await this.usersService.findOne(username)
    }))

    const input: CreateChatFuncInput = {
      ...createChatInput,
      participants: [...participantObjects]
    }

    const res = await this.chatsService.create(input);


    return Promise.all(res.participants.map(async (user) => {
      const userObj: UpdateUserInput = structuredClone(user)

      if (userObj.chats) {
        userObj.chats.push(res)
      } else {
        userObj.chats = [res]
      }
      return await this.usersService.update(userObj)
    }))

  }

  @Query(() => [Chat], { name: 'chats' })
  findAll() {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: string) {
    return this.chatsService.remove(id);
  }

  @ResolveField('messages', () => MessageConnection)
  async messages(
    @Parent() chat: Chat,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { type: () => String, nullable: true }) after?: Date
  ): Promise<MessageConnection> {
    return await this.messagesService.getMessagesForChat(chat.id, first, after);
  }

  @Subscription(() => ChatUpdate, {
    resolve: (payload: { messageAdded: ChatUpdate }) => payload.messageAdded,
    filter: (payload: { messageAdded: ChatUpdate }, variables) => variables.chatIds.includes(payload.messageAdded.chatId),
  })
  newMessage(@Args('chatIds', { type: () => [ID!]! }) chatIds: string[]) {
    return pubSub.asyncIterableIterator('newMessage')
  }

  @Mutation(() => TypingEventOutput)
  updateTyping(
    @Args('chatId') chatId: string,
    @Args('userId') userId: string,
    @Args('isTyping') isTyping: boolean,
  ) {
    // this.typingState[chatId] = this.typingState[chatId] || {};
    // this.typingState[chatId][userId] = isTyping;
    const typingStateObj = new TypingEvent(chatId, userId, isTyping)
    // Emit the event
    this.eventEmitter.emit(
      'chat.typing',
      typingStateObj
    );

    return typingStateObj;
  }

  @Subscription(() => TypingEventOutput, {
    resolve: (payload: { typeEvent: TypingEvent }) => payload.typeEvent,
    filter: (payload, variables) => payload.userTyping.chatId === variables.chatId,
  })
  userTyping(@Args('chatId', { type: () => ID! }) chatId: string) {
    return pubSub.asyncIterableIterator("userTyping")
  }
}
