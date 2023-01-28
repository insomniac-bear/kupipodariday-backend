import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ErrorCode } from 'src/exceptions/error-codes';
import { ServerException } from 'src/exceptions/server.exception';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.LoginOrPasswordIncorrect);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new ServerException(ErrorCode.LoginOrPasswordIncorrect);
    }

    return user;
  }
}
