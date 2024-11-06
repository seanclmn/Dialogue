import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

export interface createChatFuncInput {
  name: String;
  participants: User[]
}

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private usersService: UsersService
  ) { }

  async create(createChatInput: createChatFuncInput) {

    const users: User[] = await Promise.all(
      createChatInput.participants.map(async (user) => {
        return await this.usersService.findOne(user.username)
      })
    )

    const chat = new Chat();
    chat.name = createChatInput.name;
    chat.participants = users; // Assign participants directly

    // Save the chat, TypeORM will handle the join table automatically
    const res = await this.chatsRepository.save(chat);

    return await Promise.all(users.map(async (user) => {
      await this.addParticipant(res, user)
    }))
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

  async addParticipant(chat: Chat, user: User) {



    if (!chat) {
      throw new Error(`Chat with ID ${chat.id} not found`);
    }

    if (chat.participants) {
      return await this.update(chat.id, {
        ...chat,
        participants: [...chat.participants, user]
      })

    }

    return await this.update(chat.id, {
      ...chat,
      participants: [user]
    })


  }
}
