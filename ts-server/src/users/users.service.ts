import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { ChatEdge } from 'src/chats/entities/chat.edge.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { PageInfo } from 'src/relay';
import { UserEdge } from './entities/user.edge.entity';
import { FriendRequest } from './entities/friendRequests.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const CHATS_CACHE_TTL_MS = 30_000;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
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
      relations: { chats: true, sentRequests: true, incomingRequests: true },
    });
  }

  async update(user: UpdateUserInput) {
    return await this.usersRepository.save(user)
  }

  async getChatsForUser(id: string, first?: number, after?: Date) {
    const cacheKey = `chats:user:${id}:${first ?? 'all'}:${after?.toISOString() ?? ''}`;
    const cached = await this.cache.get<{ edges: ChatEdge[]; pageInfo: PageInfo }>(cacheKey);
    if (cached) return cached;

    let query = this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'filterCP')
      .innerJoin('filterCP.user', 'filterU', 'filterU.id = :id', { id })
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'pUser')
      .leftJoinAndSelect('participant.lastReadMessage', 'lastReadMessage')
      .leftJoinAndSelect('chat.lastMessage', 'lastMessage')
      .orderBy('chat.updatedAt', 'ASC');

    if (after) {
      query = query.andWhere('chat.createdAt > :after', { after });
    }
    if (first !== undefined) {
      query = query.take(first + 1);
    }

    const chats = await query.getMany();

    const edges: ChatEdge[] = chats.slice(0, first).map((chat) => ({
      cursor: chat.updatedAt.toISOString(),
      node: chat,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor || '',
      hasPreviousPage: first > 0,
      hasNextPage: chats.length > first,
    };

    const result = { edges, pageInfo };
    await this.cache.set(cacheKey, result, CHATS_CACHE_TTL_MS);
    return result;
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
    if (updateUserInput.avatarUrl !== undefined) {
      updatedUser.avatarUrl = updateUserInput.avatarUrl;
    }
    return await this.usersRepository.save(updatedUser);
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.avatarUrl = avatarUrl;
    return await this.usersRepository.save(user);
  }

  async getFriendsForUser(id: string, first?: number, after?: number) {
    // This method is now effectively handled by the FriendsService via the UsersResolver
    return { edges: [], pageInfo: { startCursor: '', endCursor: '', hasPreviousPage: false, hasNextPage: false } };
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
