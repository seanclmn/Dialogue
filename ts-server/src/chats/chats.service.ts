import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

export interface CreateChatFuncInput {
  name?: string | null;
  participants: User[];
}

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(ChatParticipant) private participantRepository: Repository<ChatParticipant>,
    private usersService: UsersService,
  ) { }

  async findExistingDM(userId1: string, userId2: string): Promise<Chat | null> {
    const candidates = await this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'cp1')
      .innerJoin('cp1.user', 'u1', 'u1.id = :userId1', { userId1 })
      .leftJoinAndSelect('chat.participants', 'cp')
      .leftJoinAndSelect('cp.user', 'u')
      .getMany();

    return (
      candidates.find(
        (chat) =>
          chat.participants.length === 2 &&
          chat.participants.some((cp) => cp.user.id === userId2),
      ) ?? null
    );
  }

  async create(createChatInput: CreateChatFuncInput): Promise<Chat> {
    const chat = await this.chatsRepository.save({ name: createChatInput.name });

    const participantRows = createChatInput.participants.map((user) =>
      this.participantRepository.create({ chat, user }),
    );
    await this.participantRepository.save(participantRows);

    return this.chatsRepository.findOne({
      where: { id: chat.id },
      relations: ['participants', 'participants.user', 'participants.lastReadMessage'],
    });
  }

  async findAll() {
    return await this.chatsRepository.find({
      relations: ['participants', 'participants.user', 'participants.lastReadMessage'],
    });
  }

  async findOne(id: string) {
    const chat = await this.chatsRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.user', 'participants.lastReadMessage'],
    });
    if (!chat) throw new NotFoundException(`Chat with ID ${id} not found`);
    return chat;
  }

  async update(updateChatInput: UpdateChatInput) {
    return await this.chatsRepository.save(updateChatInput);
  }

  async remove(id: string) {
    return `This action removes a #${id} chat`;
  }

  async addParticipant(chat: Chat, user: User): Promise<Chat> {
    if (!chat) throw new NotFoundException(`Chat not found`);

    const existing = await this.participantRepository.findOne({
      where: { chat: { id: chat.id }, user: { id: user.id } },
    });
    if (!existing) {
      await this.participantRepository.save(
        this.participantRepository.create({ chat, user }),
      );
    }

    return this.findOne(chat.id);
  }

  async markLastRead(userId: string, chatId: string, messageId: string): Promise<ChatParticipant> {
    const participant = await this.participantRepository.findOne({
      where: { chat: { id: chatId }, user: { id: userId } },
    });

    if (!participant) {
      throw new NotFoundException(`Participant not found for chat ${chatId}`);
    }

    await this.participantRepository.update(participant.id, {
      lastReadMessage: { id: messageId },
    });

    const updated = await this.participantRepository.findOne({
      where: { id: participant.id },
      relations: ['lastReadMessage', 'user'],
    });

    if (!updated) {
      throw new NotFoundException(`Participant not found after update`);
    }

    return updated;
  }
}
