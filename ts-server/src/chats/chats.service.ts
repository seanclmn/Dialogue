import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>
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
}
