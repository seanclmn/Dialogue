import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { MessageConnection } from './entities/message.connection.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { buildRelayConnection, decodeCursor } from 'src/relay-helpers';
import { User } from 'src/users/entities/user.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const MESSAGES_CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class MessagesService {
  // Tracks which cache keys belong to each chat so we can invalidate them all
  // when a new message is posted without needing a Redis SCAN.
  private readonly chatCacheKeys = new Map<string, Set<string>>();

  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) { }

  async create(createMessageInput: CreateMessageInput) {
    const chat = await this.chatsRepository.findOne({
      where: { id: createMessageInput.chatId }
    })

    const user = await this.usersRepository.findOne({
      where: { id: createMessageInput.userId }
    })
    if (!chat) throw new NotFoundException(`Chat with ID ${createMessageInput.chatId} not found`);

    let parentMessageId: string | undefined;
    if (createMessageInput.parentMessageId) {
      const parentMessage = await this.messagesRepository.findOne({
        where: { id: createMessageInput.parentMessageId },
        relations: { chat: true },
      });
      if (!parentMessage) {
        throw new NotFoundException(`Message with ID ${createMessageInput.parentMessageId} not found`);
      }
      if (parentMessage.chat.id !== createMessageInput.chatId) {
        throw new BadRequestException('Cannot reply to a message from a different chat');
      }
      if (parentMessage.parentMessageId) {
        // Keep replies flat (no threads): a reply always points at a top-level message.
        throw new BadRequestException('Cannot reply to a message that is itself a reply');
      }
      parentMessageId = parentMessage.id;
    }

    const newMessage = await this.messagesRepository.save({
      text: createMessageInput.text,
      chat: chat,
      userId: createMessageInput.userId,
      ...(createMessageInput.gifUrl && { gifUrl: createMessageInput.gifUrl }),
      ...(createMessageInput.gifWidth != null && { gifWidth: createMessageInput.gifWidth }),
      ...(createMessageInput.gifHeight != null && { gifHeight: createMessageInput.gifHeight }),
      ...(parentMessageId && { parentMessageId }),
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

    const cached = await this.cache.get<MessageConnection>(cacheKey);
    if (cached) return cached;

    const [messages, totalCount] = await this.messagesRepository.findAndCount({
      where: { chat: { id } },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    const connection = buildRelayConnection(messages, totalCount, { first, after: skip });

    await this.cache.set(cacheKey, connection, MESSAGES_CACHE_TTL_MS);

    // Register the key so invalidation can find it without a scan.
    if (!this.chatCacheKeys.has(id)) {
      this.chatCacheKeys.set(id, new Set());
    }
    this.chatCacheKeys.get(id).add(cacheKey);

    return connection;
  }

  private async invalidateMessagesCache(chatId: string): Promise<void> {
    const keys = this.chatCacheKeys.get(chatId);
    if (!keys?.size) return;

    await Promise.all([...keys].map((key) => this.cache.del(key)));
    this.chatCacheKeys.delete(chatId);
  }
}
