import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private usersService: UsersService
  ) { }

  async create(createChatInput: CreateChatInput) {
    return await this.chatsRepository.save(createChatInput)
  }

  async findAll() {
    return await this.chatsRepository.find()
  }

  async findOne(id: string) {
    return await this.chatsRepository.findOne({
      where: {
        id: id
      }
    })
  }

  async update(id: string, updateChatInput: UpdateChatInput) {
    return await this.chatsRepository.update(id, {
      ...updateChatInput
    })
  }

  async remove(id: string) {
    return `This action removes a #${id} chat`;
  }

  async addParticipant(chatId: string, userName: string) {

    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['participants'],
    });

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    const newParticipant = await this.usersService.findOne(userName)

    if (!newParticipant) {
      throw new Error(`User with username ${userName} not found`);
    }

    return await this.update(chatId, {
      ...chat,
      participants: [newParticipant]
    })

  }
}
