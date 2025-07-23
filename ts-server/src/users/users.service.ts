import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, MoreThan, Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { ChatEdge } from 'src/chats/entities/chat.edge.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { PageInfo } from 'src/relay';
import { UserEdge } from './entities/user.edge.entity';
import { FriendRequest } from './entities/friendRequests.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(FriendRequest) private friendRequestsRepository: Repository<FriendRequest>,
  ) { }

  async create(createUserInput: CreateUserInput) {
    return await this.usersRepository.save(createUserInput)
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async searchUsers(username: string) {

    return await this.usersRepository.find({
      where: { username: ILike(`%${username}%`) },
    });
  }

  async findOne(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: { chats: true },
    });
  }

  async update(user: UpdateUserInput) {
    return await this.usersRepository.save(user)
  }

  async getChatsForUser(id: string, first?: number, after?: Date) {

    const where = after
      ? { participants: { id: id }, createdAt: MoreThan(after) }
      : { participants: { id: id } };

    const chats = await this.chatsRepository.find({
      where,
      order: { updatedAt: 'ASC' },
      relations: ['participants'],
      take: first + 1, // Fetch one extra to determine if there's a next page
    });

    const edges: ChatEdge[] = chats.slice(0, first).map((chat) => ({
      cursor: chat.updatedAt.toISOString(), // Use createdAt as cursor
      node: chat,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor || '',
      hasPreviousPage: first > 0,
      hasNextPage: chats.length > first,
    };

    return { edges, pageInfo };
  }

  async getFriendRequests(receiverId: string) {
    console.log(receiverId)
    const requests = await this.friendRequestsRepository.find({
      where: {
        receiver: {
          id: receiverId
        }
      }
    })

    if (!requests) return []

    return requests
  }

  async getFriendsForUser(id: string, first?: number, after?: number) {

    const where = after
      ? { friends: { id: id }, skip: after }
      : { friends: { id: id } };

    const take = first ? first + 1 : null

    const friends = await this.usersRepository.find({
      where,
      relations: ['friends'],
      take: take, // Fetch one extra to determine if there's a next page
    });

    const edges: UserEdge[] = friends ? friends.slice(0, first).map((user) => ({
      cursor: btoa(user.id), // Use createdAt as cursor
      node: user,
    })) : []

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor || '',
      hasPreviousPage: first > 0,
      hasNextPage: friends.length > first,
    };

    return { edges, pageInfo };
  }

  async sendFriendRequest(senderId: string, receiverId: string) {
    const sender = await this.usersRepository.findOne({ where: { id: senderId } })
    const receiver = await this.usersRepository.findOne({ where: { id: receiverId } })

    const friendRequestInput = {
      sender: sender,
      receiver: receiver,
      accepted: false,
      declined: false
    }

    const newFriendRequest = await this.friendRequestsRepository.save(friendRequestInput)
    await this.usersRepository.save(
      {
        ...receiver,
        incomingRequests: receiver.incomingRequests ?
          [
            ...receiver.incomingRequests,
            newFriendRequest
          ] :
          [newFriendRequest]

      })

    return await this.usersRepository.save(
      {
        ...sender,
        sentRequests: sender.sentRequests ?
          [
            ...sender.sentRequests,
            newFriendRequest
          ] :
          [newFriendRequest]

      })
  }

  async acceptFriendRequest(friendRequestId: string) {

    const friendRequest = await this.friendRequestsRepository.findOne({ where: { id: friendRequestId } })

    if (!friendRequest) {
      throw new Error("Error processing friend request")
    }

    const sender = await this.usersRepository.findOne({ where: { id: friendRequest.sender.id } })
    const receiver = await this.usersRepository.findOne({ where: { id: friendRequest.receiver.id } })

    if (!receiver || !sender) {
      throw new Error("There was an error sending your friend request")
    }

    if (sender.friends) {
      await this.usersRepository.save({ ...sender, friends: [...sender.friends, receiver] })
    } else {
      await this.usersRepository.save({ ...sender, friends: [receiver] })
    }

    if (receiver.friends) {
      await this.usersRepository.save({ ...receiver, friends: [...receiver.friends, sender] })
    } else {
      await this.usersRepository.save({ ...receiver, friends: [sender] })
    }

    return await this.friendRequestsRepository.save({ ...friendRequest, accepted: true })
  }

  async declineFriendRequest(friendRequestId: string) {
    const friendRequest = await this.friendRequestsRepository.findOne({ where: { id: friendRequestId } })

    if (!friendRequest) {
      throw new Error("Server Error")
    }

    return await this.friendRequestsRepository.save({ ...friendRequest, declined: true })
  }

  async invalidateRefreshToken(userId: string) {
    return await this.usersRepository.update({ id: userId }, { hashedRefreshToken: null })
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.usersRepository.update({ id: userId }, { hashedRefreshToken: refreshToken })
  }

  // async inviteUsers(userNames: string[],) {
  //   const users = userNames.map(async (username) => {
  //     await this.findOne(username)

  //   })
  // }
}
