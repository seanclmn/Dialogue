import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, MoreThan, Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { ChatEdge } from 'src/chats/entities/chat.edge.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { PageInfo } from 'src/relay';
import { UserEdge } from './entities/user.edge.entity';
import { FriendRequest } from './entities/friendRequests.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
  ) { }

  async create(createUserInput: CreateUserInput) {
    return await this.usersRepository.save(createUserInput)
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async searchUsers(username: string) {

    return await this.usersRepository.find({
      where: { username: ILike(`%${username}%`) },
    });
  }

  async findOne(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: { chats: true },
    });
  }

  async update(user: UpdateUserInput) {
    return await this.usersRepository.save(user)
  }

  async getChatsForUser(id: string, first?: number, after?: Date) {
    const where = after
      ? { participants: { id: id }, createdAt: MoreThan(after) }
      : { participants: { id: id } };

    const chats = await this.chatsRepository.find({
      where,
      order: { updatedAt: 'ASC' },
      relations: ['participants'],
      take: first + 1, // Fetch one extra to determine if there's a next page
    });

    const edges: ChatEdge[] = chats.slice(0, first).map((chat) => ({
      cursor: chat.updatedAt.toISOString(), // Use createdAt as cursor
      node: chat,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor || '',
      hasPreviousPage: first > 0,
      hasNextPage: chats.length > first,
    };

    return { edges, pageInfo };
  }

  async updateUser(updateUserInput: UpdateUserInput) {
    const user = await this.usersRepository.findOne({ where: { id: updateUserInput.id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${updateUserInput.id} not found`);
    }
    const updatedUser = {
      ...user,
      username: updateUserInput.username,
      bio: updateUserInput.bio,
    };
    return await this.usersRepository.save(updatedUser);
  }

  async getFriendsForUser(id: string, first?: number, after?: number) {
    const friends = await this.usersRepository.find({
      where: { friends: { id: id } },
      relations: ['friends'],
      take: first ? first + 1 : undefined,
    });

    const edges: UserEdge[] = friends ? friends.slice(0, first).map((user) => ({
      cursor: btoa(user.id), // Use createdAt as cursor
      node: user,
    })) : []

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor || '',
      hasPreviousPage: first > 0,
      hasNextPage: friends.length > first,
    };

    return { edges, pageInfo };
  }

  // async invalidateRefreshToken(userId: string) {
  //   return await this.usersRepository.update({ id: userId }, { hashedRefreshToken: null })
  // }

  // async updateRefreshToken(userId: string, refreshToken: string) {
  //   return await this.usersRepository.update({ id: userId }, { hashedRefreshToken: refreshToken })
  // }

  // async inviteUsers(userNames: string[],) {
  //   const users = userNames.map(async (username) => {
  //     await this.findOne(username)

  //   })
  // }
}
