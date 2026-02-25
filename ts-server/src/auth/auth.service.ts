import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { hash, compare } from 'bcrypt';

export class ValidateUser {
  id: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidateUser | null> {
    const user = await this.usersService.findOne(username);

    if (!user) throw new UnauthorizedException('User does not exist');

    const valid = await compare(password, user.password);

    if (user && valid) {
      const { password: _password, ...result } = user;
      return result;
    } else throw new UnauthorizedException('Invalid password');
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
    const user = await this.usersService.findOne(createUserInput.username);

    if (user) throw new ConflictException('User already exists');

    const hashedPassword = await hash(createUserInput.password, 10);

    const newUser = await this.usersService.create({
      ...createUserInput,
      password: hashedPassword,
    });

    return {
      accessToken: this.jwtService.sign({
        username: newUser.username,
        sub: newUser.id,

      }),
      user: newUser,
    };
  }

  // async createRefreshToken(user: User) {
  //   const refreshToken = this.jwtService.sign({}, { expiresIn: "7d" })
  //   const hashedToken = hash(refreshToken, 10)
  //   await this.usersService.updateRefreshToken(user.id, hashedToken)
  // }
}
