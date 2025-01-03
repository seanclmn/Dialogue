import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MoreThan, Repository } from 'typeorm';
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

  async getMessagesForChat(id: string, first: number, after: Date): Promise<MessageConnection> {
    const where = after
      ? { chat: { id: id }, createdAt: MoreThan(after) }
      : { chat: { id: id } };

    const messages = await this.messagesRepository.find({
      where,
      order: { createdAt: 'ASC' },
      take: first + 1, // Fetch one extra to determine if there's a next page
    });

    const edges: MessageEdge[] = messages.slice(0, first).map((message) => ({
      cursor: message.createdAt.toISOString(), // Use createdAt as cursor
      node: message,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor || '',
      hasPreviousPage: first > 0,
      hasNextPage: messages.length > first,
    };

    return { edges, pageInfo };
  }
}