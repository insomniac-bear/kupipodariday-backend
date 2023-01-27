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

  async create(createUserDto: CreateUserDto): Promise<User> {
    return bcrypt.hash(createUserDto.password, 10).then((hashed) =>
      this.userRepository.save({
        ...createUserDto,
        password: hashed,
      }),
    );
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.hasOwnProperty('password')) {
      await bcrypt.hash(updateUserDto.password, 10).then((hashed) =>
        this.userRepository.update(
          { id },
          {
            ...updateUserDto,
            password: hashed,
          },
        ),
      );
    }
    await this.userRepository.update({ id }, updateUserDto);
    return await this.userRepository.findOneBy({ id });
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
