import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return bcrypt.hash(createUserDto.password, 10).then((hashed) =>
      this.userRepository.save({
        ...createUserDto,
        password: hashed,
      }),
    );
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async updateOne(user: User, updateUserDto: UpdateUserDto) {
    let updatedUser = {};

    if (updateUserDto.hasOwnProperty('password')) {
      updatedUser = await bcrypt
        .hash(updateUserDto.password, 10)
        .then((hashed) =>
          this.userRepository.save({
            ...user,
            ...updateUserDto,
            password: hashed,
          }),
        );
    } else {
      updatedUser = await this.userRepository.save({
        ...user,
        ...updateUserDto,
      });
    }

    return updatedUser;
  }

  async findMany(query: string) {
    const users = await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });

    if (!users.length) {
      throw new ServerException(ErrorCode.UsersNotFound);
    }

    return users;
  }
}
