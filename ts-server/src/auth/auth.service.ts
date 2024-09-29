import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { hash, compare } from 'bcrypt';

export class ValidateUser {
  id: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<ValidateUser | null> {
    const user = await this.usersService.findOne(username);

    if (!user) throw new Error('User does not exist');

    const valid = await compare(password, user.password);

    if (user && valid) {
      const { password, ...result } = user;
      return result;
    } else return null;
  }

  async login(user: User) {
    return {
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user,
    };
  }

  async signup(createUserInput: CreateUserInput) {
    console.log(createUserInput);
    const user = await this.usersService.findOne(createUserInput.username);

    if (user) throw new Error('User already Exists');

    const password = await hash(createUserInput.password, 10);

    console.log(password)

    const newUser = this.usersService.create({
      ...createUserInput,
      password
    })

    console.log(newUser)

    return {
      accessToken: this.jwtService.sign({
        username: newUser.username,
        sub: newUser.id,
      }),
      user: newUser,
    };
  }
}
