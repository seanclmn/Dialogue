import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserInput } from 'src/users/dto/update-user.input';

export interface CreateChatFuncInput {
  name?: string | null;
  participants: UpdateUserInput[]
}

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private usersService: UsersService,
  ) { }

  async findExistingDM(userId1: string, userId2: string): Promise<Chat | null> {
    const candidates = await this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'p1', 'p1.id = :userId1', { userId1 })
      .leftJoinAndSelect('chat.participants', 'participant')
      .getMany();

    return (
      candidates.find(
        (chat) =>
          chat.participants.length === 2 &&
          chat.participants.some((p) => p.id === userId2),
      ) ?? null
    );
  }

  async create(createChatInput: CreateChatFuncInput) {

    const chat = {
      name: createChatInput.name,
      participants: createChatInput.participants
    }

    return await this.chatsRepository.save(chat)

  }

  async findAll() {
    return await this.chatsRepository.find({
      relations: ["participants"]
    })
  }

  async findOne(id: string) {
    const chat = await this.chatsRepository.findOne({
      where: {
        id: id
      },
      relations: ["participants"]
    })
    if (!chat) throw new NotFoundException(`Chat with ID ${id} not found`);
    return chat;
  }

  async update(updateChatInput: UpdateChatInput) {
    return await this.chatsRepository.save(updateChatInput)
  }

  async remove(id: string) {
    return `This action removes a #${id} chat`;
  }

  async addParticipant(chat: Chat, user: User) {

    if (!chat) {
      throw new NotFoundException(`Chat not found`);
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
