import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { MessageConnection } from './entities/Message.Connection.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { buildRelayConnection, decodeCursor } from 'src/relay-helpers';

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

  async getMessagesForChat(
    id: string,
    first: number,
    after?: string
  ): Promise<MessageConnection> {
    const skip = decodeCursor(after);
    const take = first || 20;

    const [messages, totalCount] = await this.messagesRepository.findAndCount({
      where: { chat: { id } },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return buildRelayConnection(messages, totalCount, { first, after: skip });
  }
}
