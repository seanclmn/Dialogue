import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>){}

  private readonly users = [
    {
      username: 'seanclmn',
      password: '$2b$10$CqkDDWiGxecrcusjRtYRkOFNmgdEcQdlnV/qM6OhO34UFa2ld5FnO',
      id: 1
    }
  ];

  create(createUserInput: CreateUserInput) {
    const user = {
      ...createUserInput,
      id: this.users.length + 1,
    };

    this.users.push(user);
    return user;
  }

  findAll() {
    return this.usersRepository.find()
  }

  findOne(username: string) {
    return this.usersRepository.findOne({
      where: {
        username: username
      }
    })
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
