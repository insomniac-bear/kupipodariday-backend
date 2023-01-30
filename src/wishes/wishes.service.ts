import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

export enum TypeOfGetWish {
  Last = 'Last',
  Top = 'Top',
}

export enum FindingWishesParam {
  ById = 'id',
  ByName = 'name',
  ByOwnerId = 'ownerId',
}

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(id: number, createWishDto: CreateWishDto) {
    const user = await this.userRepository.findOneBy({ id });

    const wish = this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  findUsersWishes(id: number) {
    return this.wishRepository.find({
      where: {
        owner: {
          id,
        },
      },
    });
  }

  findWishesByParam(paramName: FindingWishesParam, paramValue: string) {
    return this.wishRepository.find({
      where: {
        [paramName]: paramValue,
      },
    });
  }

  findLastWishes() {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
