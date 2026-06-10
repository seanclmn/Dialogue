import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { MessageConnection } from './entities/message.connection.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { buildRelayConnection, decodeCursor } from 'src/relay-helpers';
import { User } from 'src/users/entities/user.entity';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';

const MESSAGES_CACHE_TTL_SECONDS = 300;

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && ISO_DATE_RE.test(value)) {
    return new Date(value);
  }
  return value;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) { }

  async create(createMessageInput: CreateMessageInput) {
    const chat = await this.chatsRepository.findOne({
      where: { id: createMessageInput.chatId }
    })

    const user = await this.usersRepository.findOne({
      where: { id: createMessageInput.userId }
    })
    if (!chat) throw new NotFoundException(`Chat with ID ${createMessageInput.chatId} not found`);
    const newMessage = await this.messagesRepository.save({
      text: createMessageInput.text,
      chat: chat,
      userId: createMessageInput.userId,
      ...(createMessageInput.gifUrl && { gifUrl: createMessageInput.gifUrl }),
      ...(createMessageInput.gifWidth != null && { gifWidth: createMessageInput.gifWidth }),
      ...(createMessageInput.gifHeight != null && { gifHeight: createMessageInput.gifHeight }),
      username: user.username,
    })
    await this.chatsRepository.save({
      ...chat,
      lastMessage: newMessage
    })

    await this.invalidateMessagesCache(createMessageInput.chatId);

    return newMessage;
  }

  async findAll() {
    return await this.messagesRepository.find()
  }

  async findOne(id: string) {
    const message = await this.messagesRepository.findOne({
      where: {
        id: id,
      }
    });
    if (!message) throw new NotFoundException(`Message with ID ${id} not found`);
    return message;
  }

  async update(updateMessageInput: UpdateMessageInput) {
    return await this.messagesRepository.save(updateMessageInput)
  }

  async getMessagesForChat(
    id: string,
    first: number,
    after?: string
  ): Promise<MessageConnection> {
    const skip = decodeCursor(after);
    const take = first || 20;
    const cacheKey = `chat:messages:${id}:${skip}:${take}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached, dateReviver) as MessageConnection;
    }

    const [messages, totalCount] = await this.messagesRepository.findAndCount({
      where: { chat: { id } },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    const connection = buildRelayConnection(messages, totalCount, { first, after: skip });

    await this.redis.set(cacheKey, JSON.stringify(connection), 'EX', MESSAGES_CACHE_TTL_SECONDS);

    return connection;
  }

  private async invalidateMessagesCache(chatId: string): Promise<void> {
    const pattern = `chat:messages:${chatId}:*`;
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
      cursor = nextCursor;
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } while (cursor !== '0');
  }
}
