import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ChatsService, CreateChatFuncInput } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserInput } from 'src/users/dto/update-user.input';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService,
    private usersService: UsersService
  ) { }

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

    return this.chatsService.create(input);
  }

  @Query(() => [Chat], { name: 'chats' })
  findAll() {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: string) {
    return this.chatsService.remove(id);
  }
}
