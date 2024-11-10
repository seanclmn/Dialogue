import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserInput } from 'src/users/dto/update-user.input';

export interface CreateChatFuncInput {
  name: String;
  participants: UpdateUserInput[]
}

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private usersService: UsersService,
  ) { }

  async create(createChatInput: CreateChatFuncInput) {

    const chat = {
      name: createChatInput.name,
      participants: createChatInput.participants
    }

    console.log(chat.participants)

    return await this.chatsRepository.save(chat)

  }

  async findAll() {
    return await this.chatsRepository.find({
      relations: ["participants"]
    })
  }

  async findOne(id: string) {
    return await this.chatsRepository.findOne({
      where: {
        id: id
      },
      relations: ["participants"]
    })
  }

  async update(updateChatInput: UpdateChatInput) {
    return await this.chatsRepository.save(updateChatInput)
  }

  async remove(id: string) {
    return `This action removes a #${id} chat`;
  }

  async addParticipant(chat: Chat, user: User) {

    if (!chat) {
      throw new Error(`Chat with ID ${chat.id} not found`);
    }

    if (chat.participants) {
      return await this.update({
        ...chat,
        participants: [...chat.participants, user]
      })

    }

    return await this.update({
      ...chat,
      participants: [user]
    })
  }
}
