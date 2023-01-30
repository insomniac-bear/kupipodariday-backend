import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

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

  findLastWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  findTopWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const candidate = await this.findOne(id);

    if (!candidate) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (candidate.owner.id !== userId) {
      throw new ServerException(ErrorCode.NoRightsForEdit);
    }

    return this.wishRepository.save({
      id,
      ...updateWishDto,
    });
  }

  async remove(id: number, userId: number) {
    const candidate = await this.findOne(id);

    if (!candidate) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (candidate.owner.id !== userId) {
      throw new ServerException(ErrorCode.NoRightsForEdit);
    }

    return this.wishRepository.delete({ id });
  }
}
