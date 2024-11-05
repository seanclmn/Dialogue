import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

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

    const user = context.req.user;

    if (!user) {
      throw new UnauthorizedException('You are not authorized to view this profile');
    }

    const participantObjects: User[] = await Promise.all(createChatInput.participants.map(async (user) => {
      return await this.usersService.findOne(user.username)
    }))

    const input = {
      ...createChatInput,
      participants: [...participantObjects, user]
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
