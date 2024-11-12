import { Resolver, Query, Mutation, Args, Int, Context, ID } from '@nestjs/graphql';
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
}
