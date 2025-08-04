import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { MessageEdge } from './entities/message.edge.entity';
import { MessageConnection } from './entities/Message.Connection.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { PageInfo } from 'src/relay';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
  ) { }

  async create(createMessageInput: CreateMessageInput) {
    const chat = await this.chatsRepository.findOne({
      where: { id: createMessageInput.chatId }
    })
    const newMessage = await this.messagesRepository.save({
      text: createMessageInput.text,
      chat: chat,
      userId: createMessageInput.userId
    })
    await this.chatsRepository.save({
      ...chat,
      lastMessage: newMessage
    })
    return newMessage;
  }

  async findAll() {
    return await this.messagesRepository.find()
  }

  async findOne(id: string) {
    return await this.messagesRepository.findOne({
      where: {
        id: id,
      }
    });
  }

  async update(updateMessageInput: UpdateMessageInput) {
    return await this.messagesRepository.save(updateMessageInput)
  }

  async getMessagesForChat(id: string, first: number, after?: Date): Promise<MessageConnection> {
    const where = after
      ? { chat: { id: id }, createdAt: LessThan(after) }
      : { chat: { id: id } };

    const messages = await this.messagesRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: first + 1, // Fetch one extra to determine if there's a next page
    });

    // Take only the requested number of messages
    const requestedMessages = messages.slice(0, first);
    const hasNextPage = messages.length > first;

    const edges: MessageEdge[] = requestedMessages.map((message) => ({
      cursor: message.createdAt.toISOString(),
      node: message,
    }));

    // Check if there are previous pages by looking for messages newer than our start cursor
    let hasPreviousPage = false;
    if (after) {
      // If we have an 'after' cursor, there are definitely previous (newer) messages
      hasPreviousPage = true;
    } else if (edges.length > 0) {
      // Check if there are any messages newer than our first message
      const newerMessagesCount = await this.messagesRepository.count({
        where: {
          chat: { id: id },
          createdAt: MoreThan(new Date(edges[0].cursor))
        }
      });
      hasPreviousPage = newerMessagesCount > 0;
    }

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
      hasPreviousPage,
      hasNextPage,
    };

    return { edges, pageInfo };
  }

  // Alternative simpler version if you don't need to check for previous pages accurately
  async getMessagesForChatSimple(id: string, first: number, after?: Date): Promise<MessageConnection> {
    const where = after
      ? { chat: { id: id }, createdAt: LessThan(after) }
      : { chat: { id: id } };

    const messages = await this.messagesRepository.find({
      where,
      order: { createdAt: 'ASC' },
      take: first + 1,
    });

    const requestedMessages = messages.slice(0, first);
    const hasNextPage = messages.length > first;

    const edges: MessageEdge[] = requestedMessages.map((message) => ({
      cursor: message.createdAt.toISOString(),
      node: message,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
      hasPreviousPage: !!after, // Simple: if we have an 'after' cursor, assume there are previous pages
      hasNextPage,
    };

    return { edges, pageInfo };
  }
}