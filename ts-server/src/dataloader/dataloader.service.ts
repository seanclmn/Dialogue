import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as DataLoader from 'dataloader';
import { Friendship } from '../friends/entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class DataloaderService implements OnModuleInit {
  private isFriendLoader: DataLoader<string, boolean>;
  private userByUsernameLoader: DataLoader<string, User | null>;
  private messageByIdLoader: DataLoader<string, Message | null>;

  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  onModuleInit() {
    this.isFriendLoader = this.createIsFriendLoader();
    this.userByUsernameLoader = this.createUserByUsernameLoader();
    this.messageByIdLoader = this.createMessageByIdLoader();
  }

  /**
   * Returns whether `userId` is friends with `friendId`.
   *
   * All calls that occur within the same Node.js tick are automatically
   * batched into a single SELECT…WHERE IN (…) by the underlying DataLoader,
   * replacing the previous per-user COUNT query (N+1 pattern).
   *
   * `cache: false` means the loader never caches across ticks, so stale data
   * cannot leak between requests.
   */
  isFriend(userId: string, friendId: string): Promise<boolean> {
    return this.isFriendLoader.load(`${userId}:${friendId}`);
  }

  /**
   * Looks up a User by username.
   *
   * All calls within the same tick are collapsed into one
   * WHERE username IN (…) query, replacing the N individual findOne calls
   * in createChat.
   */
  userByUsername(username: string): Promise<User | null> {
    return this.userByUsernameLoader.load(username);
  }

  /**
   * Looks up a Message by id.
   *
   * Used to resolve the `parentMessage` field on replies; batches all lookups
   * within the same tick into a single WHERE id IN (…) query.
   */
  messageById(id: string): Promise<Message | null> {
    return this.messageByIdLoader.load(id);
  }

  /**
   * Batches isFriend checks for a list of (currentUserId, targetUserId) pairs
   * (encoded as "currentUserId:targetUserId" strings) into a single DB query.
   */
  private createIsFriendLoader(): DataLoader<string, boolean> {
    return new DataLoader<string, boolean>(
      async (keys: readonly string[]) => {
        const pairs = keys.map((k) => {
          const [userId, friendId] = k.split(':');
          return { userId, friendId };
        });

        const userIds = [...new Set(pairs.map((p) => p.userId))];
        const friendIds = [...new Set(pairs.map((p) => p.friendId))];

        const friendships = await this.friendshipRepository
          .createQueryBuilder('friendship')
          .select('u.id', 'userId')
          .addSelect('f.id', 'friendId')
          .leftJoin('friendship.user', 'u')
          .leftJoin('friendship.friend', 'f')
          .where('u.id IN (:...userIds)', { userIds })
          .andWhere('f.id IN (:...friendIds)', { friendIds })
          .getRawMany<{ userId: string; friendId: string }>();

        const friendSet = new Set(
          friendships.map((row) => `${row.userId}:${row.friendId}`),
        );

        return keys.map((key) => friendSet.has(key));
      },
      { cache: false },
    );
  }

  /**
   * Batches user lookups by username into a single WHERE username IN (…) query.
   */
  private createUserByUsernameLoader(): DataLoader<string, User | null> {
    return new DataLoader<string, User | null>(
      async (usernames: readonly string[]) => {
        const users = await this.usersRepository.find({
          where: { username: In([...usernames]) },
        });
        const userMap = new Map(users.map((u) => [u.username, u]));
        return usernames.map((username) => userMap.get(username) ?? null);
      },
      { cache: false },
    );
  }

  /**
   * Batches parent-message lookups for replies into a single WHERE id IN (…) query.
   */
  private createMessageByIdLoader(): DataLoader<string, Message | null> {
    return new DataLoader<string, Message | null>(
      async (ids: readonly string[]) => {
        const messages = await this.messagesRepository.find({
          where: { id: In([...ids]) },
        });
        const messageMap = new Map(messages.map((m) => [m.id, m]));
        return ids.map((id) => messageMap.get(id) ?? null);
      },
      { cache: false },
    );
  }
}
